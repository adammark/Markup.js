var Mark = {
    // comment
    includes: {
    },

    // comment
    _copy: function (a, b) {
        b = b || [];
        for (var i in a) {
            b[i] = a[i];
        }
        return b;
    },

    // comment
    _size: function (a) {
        return a instanceof Array ? a.length : a;
    },

    // comment
    _iter: function (idx, size) {
        this.idx = idx;
        this.size = size;
        this.sign = "#";
        this.prototype = Number;
        this.toString = this.valueOf = function () {
            return this.idx + this.sign.length - 1;
        };
    },

    // comment
    _pipe: function (val, filters) {
        var filter = filters.shift(), fn, args;
        if (filter) {
            fn = filter.split(">").shift().trim();
            args = filter.split(">").splice(1);
            val = Mark._pipe(Mark.pipes[fn].apply(null, [val].concat(args)), filters);
        }
        return val;
    },

    // comment
    _bridge: function (tpl, tkn) {
        var exp = "{{" + tkn + "([^/}]+\\w*)?}}|{{/" + tkn + "}}",
            re = new RegExp(exp, "g"),
            tags = tpl.match(re),
            t,
            a = 0,
            b = 0,
            c = -1,
            d = 0;

        for (t in tags) {
            c = tpl.indexOf(tags[t], c + 1);

            if (tags[t].match("{{/")) {
                b++;
            }
            else {
                a++;
            }

            if (a === b) {
                break;
            }
        }

        a = tpl.indexOf(tags[0]);
        b = a + tags[0].length;
        d = c + tags[t].length;

        return [tpl.substring(a, d), tpl.substring(b, c)];
    }
};

Mark.up = function (template, context, options, undefined) {
    context = context || {};

    var re = /\{\{\w*[^}]+\w*\}\}/g,
        tags = template.match(re) || [],
        pipe = Mark._pipe,
        tag,
        prop,
        token,
        filters = [],
        selfy,
        testy,
        child,
        tmp,
        result,
        i = 0,
        x;

    // comment
    if (options) {
        Mark._copy(options.pipes, Mark.pipes);
        Mark._copy(options.includes, Mark.includes);
    }

    // comment
    function test(result, child, context, options) {
        child = Mark.up(child, context, options).split("{{else}}");

        if (testy) {
            result = child[result === false ? 1 : 0];
            result = Mark.up(result || "", context, options);
        }

        return result;
    }

    // comment
    while ((tag = tags[i++])) {
        result = undefined;
        child = "";
        selfy = tag.indexOf("/}}") > -1;
        prop = tag.substr(2, tag.length - (selfy ? 5 : 4));
        testy = prop.indexOf("if ") === 0;
        filters = prop.replace(/&gt;/g, ">").split("|").splice(1);
        prop = prop.replace(/^if/, "").split("|").shift().trim();
        token = testy ? "if" : prop.split("|")[0];

        // comment
        if (!selfy && tags.indexOf("{{/" + token + "}}") > -1) {
            result = Mark._bridge(template, token);
            tag = result[0];
            child = result[1];
            i += tag.match(re).length - 1;
        }

        // comment
        if (Mark.includes[prop]) {
            result = pipe(Mark.up(Mark.includes[prop], context), filters);
        }

        // comment
        else if (prop === ".") {
            result = test(pipe(context, filters), child, context);
        }

        // comment
        else if (prop.match(/#{1,2}/)) {
            options.iter.sign = prop;
            result = test(pipe(options.iter, filters), child, context, options);
        }

        // comment
        else if (tag === "{{else}}") {
            continue;
        }

        // comment
        else if (prop.match(/\./)) {
            prop = prop.split(".");
            for (x = 0, tmp = context; x < prop.length; x++) {
                tmp = tmp[prop[x]];
            }
            result = test(pipe(tmp, filters), child, context);
        }

        // comment
        else if (testy) {
            result = true;
            if (!filters.length) {
                if (context[prop] === undefined || (context[prop] instanceof Array && !context[prop].length)) {
                    result = false;
                }
            }
            result = test(result && pipe(context[prop], filters), child, context);
        }

        // comment
        else if (context[prop] instanceof Array) {
            result = tmp = pipe(context[prop], filters);
            if (tmp instanceof Array) {
                result = "";
                for (x in tmp) {
                    result += child ? Mark.up(child, tmp[x], {iter: new Mark._iter(+x, tmp.length)}) : tmp[x];
                }
            }
        }

        // comment
        else if (child) {
            result = Mark.up(child, context[prop]);
        }

        // comment
        else if (context.hasOwnProperty(prop)) {
            result = pipe(context[prop], filters);
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
        return a == b ? a : false;
    },
    notequals: function (a, b) {
        return a != b ? a : false;
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
        return Math.round(+(num));
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
        return (+num).toFixed(n);
    },
    mod: function (num, n) {
        return (+num) % (+n);
    },
    divisible: function (num, n) {
        return num !== false && num % n === 0 ? num : false;
    },
    even: function (num) {
        return num !== false && num % 2 === 0 ? num : false;
    },
    odd: function (num) {
        return num !== false && num % 2 === 1 ? num : false;
    },
    number: function (str) {
        return parseFloat(str.replace(/[^\-\d\.]/g, ""));
    },
    url: function (str) {
        return encodeURI(str);
    },
    bool: function (obj) {
        return !!obj;
    },
    falsy: function (obj) {
        return !obj;
    },
    first: function (iter) {
        return iter.idx === 0;
    },
    last: function (iter) {
        return iter.idx === iter.size - 1;
    },
    call: function (obj, fn) {
        return obj[fn].apply(obj, [].slice.call(arguments, 2));
    }
};
