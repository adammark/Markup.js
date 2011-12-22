/*
  Markup.js v1.1: http://github.com/adammark/Markup.js
  (c) 2011 Adam Mark
*/
var Mark = {
    // templates to include, by name
    includes: {},
    
    // helper fn: copy array a, or copy array a into b. return b
    _copy: function (a, b) {
        b = b || [];

        for (var i in a) {
            b[i] = a[i];
        }

        return b;
    },

    // helper fn: get the size of an array or number
    _size: function (a) {
        return a instanceof Array ? a.length : a;
    },

    // an iterator with an index (0...n-1) ("#") and size (n) ("##")
    _iter: function (idx, size) {
        this.idx = idx;
        this.size = size;
        this.length = size;
        this.sign = "#";
        this.prototype = Number;
        this.toString = this.valueOf = function () {
            return this.idx + this.sign.length - 1;
        };
    },

    // pipe an obj through filters. e.g. _pipe(123, "add>10|times>5")
    _pipe: function (val, filters) {
        var filter = filters.shift(), fn, args;

        if (filter) {
            fn = filter.split(">").shift().trim();
            args = filter.split(">").splice(1);
            try {
                val = Mark._pipe(Mark.pipes[fn].apply(null, [val].concat(args)), filters);
            }
            catch (e) {
            }
        }

        return val;
    },

    // get the full extent of a block tag given a template and token (e.g. "if")
    _bridge: function (tpl, tkn) {
        var exp = "{{\\s*" + tkn + "([^/}]+\\w*)?}}|{{/" + tkn + "\\s*}}",
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

        // return block "{{if abc}}123{{/abc}}" and child of block "123"
        return [tpl.substring(a, d), tpl.substring(b, c)];
    }
};

// fill a template string with context data. return transformed template
Mark.up = function (template, context, options, undefined) {
    context = context || {};
    options = options || {};

    var re = /\{\{\w*[^}]+\w*\}\}/g,
        tags = template.toString().match(re) || [],
        pipe = Mark._pipe,
        tag,
        prop,
        token,
        filters = [],
        testy,
        child,
        ctx,
        result,
        i = 0,
        x;

    // set custom pipes, if any
    if (options.pipes) {
        Mark._copy(options.pipes, Mark.pipes);
    }

    // set templates to include, if any
    if (options.includes) {
        Mark._copy(options.includes, Mark.includes);
    }

    // get "if" or "else" string from piped result
    function test(result, child, context, options) {
        child = Mark.up(child, context, options).split(/{{\s*else\s*}}/);

        if (testy) {
            result = child[result === false ? 1 : 0];
            result = Mark.up(result || "", context, options);
        }

        return result;
    }

    // loop through tags, e.g. {{a}}, {{b}}, {{c}}, {{/c}}
    while ((tag = tags[i++])) {
        result = undefined;
        child = "";
        prop = tag.substr(2, tag.length - 4);
        prop = prop.replace(/`(\w+)`/g, function (s, m) {
            return Mark.includes[m];
        });
        testy = prop.trim().indexOf("if ") === 0;
        filters = prop.replace(/&gt;/g, ">").split("|").splice(1);
        prop = prop.replace(/^\s*if/, "").split("|").shift().trim();
        token = testy ? "if" : prop.split("|")[0];

        // determine the full extent of a block tag and its child
        if (tags.join().indexOf("{{/" + token) > -1) {
            result = Mark._bridge(template, token);
            tag = result[0];
            child = result[1];
            i += tag.match(re).length - 1; // fast forward
        }

        // tag refers to included template
        if (Mark.includes[prop]) {
            prop = Mark.includes[prop];
            if (prop instanceof Function) {
                prop = prop();
            }
            result = pipe(Mark.up(prop, context), filters);
        }

        // tag refers to current context
        else if (prop === ".") {
            result = test(pipe(context, filters), child, context);
        }

        // tag refers to loop counter
        else if (prop.match(/#{1,2}/)) {
            options.iter.sign = prop;
            result = test(pipe(options.iter, filters), child, context, options);
        }

        // skip "else" tags. these will be pulled out in test()
        else if (/^{{\s*else\s*}}$/.test(tag)) {
            continue;
        }

        // tag has dot notation, e.g. "a.b.c". traverse it to get the actual context
        else if (prop.match(/\./)) {
            prop = prop.split(".");
            for (x = 0, ctx = context; x < prop.length; x++) {
                ctx = ctx[prop[x]];
            }
            result = test(pipe(ctx, filters), child, context);
        }

        // tag is otherwise testable
        else if (testy) {
            result = true;
            // allow test for empty/undefined without filter (e.g "{{if foo}}...{{/if}}")
            if (!filters.length) {
                if (!context[prop] || context[prop].length === 0) {
                    result = false;
                }
            }
            result = test(result && pipe(context[prop], filters), child, context);
        }

        // context is an array. loop through piped array
        else if (context[prop] instanceof Array) {
            result = ctx = pipe(context[prop], filters);
            if (ctx instanceof Array) {
                result = "";
                for (x in ctx) {
                    // for each, new iterator
                    options = { iter: new Mark._iter(+x, ctx.length) };
                    result += child ? Mark.up(child, ctx[x], options) : ctx[x];
                }
            }
        }

        // if an object block, process child contents, e.g. {{foo}}child{{/foo}}
        else if (child) {
            result = context[prop] ? Mark.up(child, context[prop]) : undefined;
        }

        // else all others
        else if (context.hasOwnProperty(prop)) {
            result = pipe(context[prop], filters);
        }

        // replace the tag, e.g. "{{name}}", with the result, e.g. "Adam"
        template = template.replace(tag, result === undefined ? "???" : result);
    }

    return template;
};

// "out of the box" pipes. see README
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
        return Math.round(+num);
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
        return arr.slice(+start, (+start) + (+length));
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
    },
    set: function (obj, key) {
        Mark.includes[key] = obj; return "";
    }
};
