var Mark = {
    _copy: function (a) {
        var i, b = [];
        for (i in a) {
            b[i] = a[i];
        }
        return b;
    },
    _size: function (a) {
        return a instanceof Array ? a.length : a;
    },
    includes: {}
};

Mark.up = function (template, context, options) {
    context = context || {};

    var tags = template.match(/\{\{\w*[^}]+\w*\}\}/g) || [],
        tag,
        endtag,
        prop,
        filters = [],
        selfy,
        testy,
        child,
        evaled,
        result,
        i = 0,
        x,
        a, b;

    // set options if any. only need to do once!
    if (options) {
        for (x in options.pipes) {
            Mark.pipes[x] = options.pipes[x];
        }
        for (x in options.includes) {
            Mark.includes[x] = options.includes[x];
        }
    }

    // pipe a string value. ex: pipe("adam", ["upcase","chop>50"])
    function pipe(val, filters) {
        var filter = filters.shift(), fn, args;
        if (filter) {
            fn = filter.split(">").shift().trim();
            args = filter.split(">").splice(1);
            return pipe(Mark.pipes[fn].apply(null, [val].concat(args)), filters);
        }
        return val;
    }

    function test(obj, child, context, options) {
        if (testy) {
            return obj !== false ? Mark.up(child, context, options) : "";
        }
        return obj;
    }

    // TODO comments
    while ((tag = tags[i++])) {
        selfy = tag.indexOf("/}}") > -1;
        prop = tag.substr(2, tag.length - (selfy ? 5 : 4));
        testy = prop.indexOf("if ") === 0;
        filters = prop.split("|").splice(1);
        prop = prop.replace(/^if/, "").split("|").shift().trim();
        endtag = "{{/" + (testy ? "if" : prop.split("|")[0]) + "}}";
        child = "";
        result = undefined;

        if (!selfy && tags.indexOf(endtag, i) > -1) {
            i = tags.indexOf(endtag, i) + 1; // fast forward
            a = template.indexOf(tag);
            b = template.indexOf(endtag);
            child = template.substring(a + tag.length, b);
            tag = template.substring(a, b + endtag.length);
        }

        if (Mark.includes[prop]) {
            result = pipe(Mark.up(Mark.includes[prop], context), filters);
        }
        else if (prop === ".") {
            result = test(pipe(context, filters), child, context);
        }
        else if (prop === "#" || prop === "##") {
            x = options.iter + prop.length - 1;
            result = test(pipe(x, filters), child, context, options);
        }
        else if ((prop = prop.split(".")).length > 1) {
            for (x = 0, evaled = context; x < prop.length; x++) {
                evaled = evaled[prop[x]];
            }
            result = test(pipe(evaled, filters), child, context);
        }
        else if (context.hasOwnProperty(prop)) {
            if (testy) {
                result = test(pipe(context[prop], filters), child, context);
            }
            else if (context[prop] instanceof Array) {
                result = evaled = pipe(context[prop], filters);
                if (evaled instanceof Array) {
                    result = "";
                    for (x in evaled) {
                        result += child ? Mark.up(child, evaled[x], {iter: +x}) : evaled[x];
                    }
                }
            }
            else if (child) {
                result = Mark.up(child, context[prop]);
            }
            else {
                result = pipe(context[prop], filters);
            }
        }

        template = template.replace(tag, result === undefined ? "???" : result);
    }

    return template;
};

Mark.pipes = {
    blank: function (str, val) {
        return !!str || str === 0 ? str : val;
    },
    empty: function (obj) {
        return !obj || (obj + "").trim().length === 0 ? obj : false;
    },
    notempty: function (obj) {
        return obj && (obj + "").trim().length ? obj : false;
    },
    more: function (a, b) {
        return Mark._size(a) > b ? a : false;
    },
    less: function (a, b) {
        return Mark._size(a) < b ? a : false;
    },
    ormore: function (a, b) {
        return Mark._size(a) >= b ? a : false;
    },
    orless: function (a, b) {
        return Mark._size(a) <= b ? a : false;
    },
    between: function (a, b, c) {
        a = Mark._size(a);
        return a >= b && a <= c ? a : false;
    },
    equals: function (a, b) {
        return a.toString() === b.toString() ? a : false;
    },
    notequals: function (a, b) {
        return a.toString() !== b.toString() ? a : false;
    },
    like: function (str, pattern) {
        return new RegExp(pattern).test(str) ? str : false;
    },
    notlike: function (str, pattern) {
        return !Mark.pipes.like(str, pattern) ? str : false;
    },
    upcase: function (str) {
        return String(str).toUpperCase();
    },
    downcase: function (str) {
        return String(str).toLowerCase();
    },
    chop: function (str, n) {
        return str.length > n ? str.substr(0, n) + "..." : str;
    },
    trim: function (str) {
        return str.trim();
    },
    pack: function (str) {
        return str.trim().replace(/\s{2,}/g, " ");
    },
    round: function (num) {
        return Math.round(parseFloat(num));
    },
    style: function (str, classes) {
        return '<span class="' + classes + '">' + str + '</span>';
    },
    clean: function (str) {
        return String(str).replace(/<\/?[^>]+>/gi, "");
    },
    sub: function (str, pattern, replacement) {
        return String(str).replace(new RegExp(pattern, "g"), replacement);
    },
    size: function (obj) {
        return obj.length;
    },
    length: function (obj) {
        return obj.length;
    },
    reverse: function (arr) {
        return Mark._copy(arr).reverse();
    },
    join: function (arr, separator) {
        return arr.join(separator);
    },
    limit: function (arr, count) {
        return arr.slice(0, count);
    },
    slice: function (arr, start, length) {
        return arr.slice(start, parseInt(start, 0) + parseInt(length, 0));
    },
    split: function (str, separator) {
        return str.split(separator || ",");
    },
    choose: function (bool, iffy, elsy) {
        return !!bool ? iffy : elsy;
    },
    sort: function (arr, prop) {
        var fn = function (a, b) {
            return a[prop] > b[prop] ? 1 : -1;
        };
        return Mark._copy(arr).sort(prop ? fn : undefined);
    },
    fix: function (num, n) {
        return num.toFixed(n);
    },
    mod: function (num, n) {
        return (+num) % (+n);
    },
    divisible: function (num, n) {
        return typeof num == "number" && num % n === 0 ? num : false;
    },
    even: function (num) {
        return typeof num == "number" && num % 2 === 0 ? num : false;
    },
    odd: function (num) {
        return typeof num == "number" && num % 2 === 1 ? num : false;
    },
    url: function (str) {
        return encodeURI(str);
    },
    bool: function (obj) {
        return !!obj;
    },
    call: function (obj, fn) {
        return obj[fn].apply(obj, [].slice.call(arguments, 2));
    }
};
