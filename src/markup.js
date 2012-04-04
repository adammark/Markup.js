/*
  Markup.js v1.5.8: http://github.com/adammark/Markup.js
  MIT License
  (c) 2011 Adam Mark
*/
var Mark = {
    // templates to include, by name
    includes: {},

    // global variables, by name
    globals: {},

    // argument delimiter
    delimiter: ">",

    // compact white space between HTML nodes
    compact: false,

    // return a copy of array A or copy array A into array B (returning B)
    _copy: function (a, b) {
        b = b || [];

        for (var i in a) {
            b[i] = a[i];
        }

        return b;
    },

    // get the length of array A, or simply return A. see pipes, below
    _size: function (a) {
        return a instanceof Array ? a.length : (a || 0);
    },

    // an object with an index (0...n-1) ("#") and size (n) ("##")
    _iter: function (idx, size) {
        this.idx = idx;
        this.size = size;
        this.length = size;
        this.sign = "#";
        this.toString = function () {
            return this.idx + this.sign.length - 1;
        };
    },

    // pipe an obj through filters. e.g. _pipe(123, ["add>10","times>5"])
    _pipe: function (val, filters) {
        // get the first filter, e.g. "add>10"
        var filter = filters.shift(), parts, fn, args;

        if (filter) {
            parts = filter.split(this.delimiter); // e.g. ["add", "10"]
            fn = parts[0].trim(); // e.g. "add"
            args = parts.splice(1); // e.g. "10"

            try {
                // apply the piped fn to val, then pipe again
                val = this._pipe(Mark.pipes[fn].apply(null, [val].concat(args)), filters);
            }
            catch (e) {
            }
        }

        // return the result of the piped value
        return val;
    },

    // evaluate an array or object and process its child contents (if any)
    _eval: function (context, filters, child) {
        var result = this._pipe(context, filters),
            ctx = result,
            i = -1,
            j,
            opts;

        // if result is array, iterate
        if (result instanceof Array) {
            result = "";
            j = ctx.length;

            while (++i < j) {
                opts = {
                    iter: new this._iter(i, j)
                };
                result += child ? Mark.up(child, ctx[i], opts) : ctx[i];
            }
        }

        return result;
    },

    // get "if" or "else" string from piped result
    _test: function (result, child, context, options) {
        var str = Mark.up(child, context, options).split(/\{\{\s*else\s*\}\}/),
            res = (result === false ? str[1] : str[0]);

        return Mark.up(res || "", context, options);
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

        // return "{{abc}}xyz{{/abc}}" and "xyz"
        return [tpl.substring(a, d), tpl.substring(b, c)];
    }
};

// fill a template string with context data. return transformed template
Mark.up = function (template, context, options) {
    context = context || {};
    options = options || {};

    // pattern matching any tag, e.g. "{{apples}}" and "{{/apples}}"
    var re = /\{\{\w*[^}]+\w*\}\}/g,
        // an array of tags
        tags = template.match(re) || [],
        // the tag being evaluated
        tag,
        // the string to evaluate, e.g. "hamster|dance"
        prop,
        // the token that might be terminated by "{{/token}}"
        token,
        // an array of filters, e.g. ["more>1", "less>2"]
        filters = [],
        // is the tag self-closing? e.g. "{{stuff/}}"
        selfy,
        // is the tag an "if" statement?
        testy,
        // the string inside a block tag, e.g. "{{a}}...{{/a}}"
        child,
        // a shortcut for context[prop]
        ctx,
        // the result string
        result,
        // the global being evaluated, or undefined
        global,
        // the include being evaluated, or undefined
        include,
        // iterator variable
        i = 0,
        // iterator variable
        j = 0;

    // set custom pipes, if any
    if (options.pipes) {
        this._copy(options.pipes, this.pipes);
    }

    // set templates to include, if any
    if (options.includes) {
        this._copy(options.includes, this.includes);
    }

    // set global variables, if any
    if (options.globals) {
        this._copy(options.globals, this.globals);
    }

    // override delimiter
    if (options.delimiter) {
        this.delimiter = options.delimiter;
    }

    // compact HTML?
    if (options.compact !== undefined) {
        this.compact = options.compact;
    }

    // loop through tags, e.g. {{a}}, {{b}}, {{c}}, {{/c}}
    while ((tag = tags[i++])) {
        result = undefined;
        child = "";
        selfy = tag.indexOf("/}}") > -1;
        prop = tag.substr(2, tag.length - (selfy ? 5 : 4));
        prop = prop.replace(/`([^`]+)`/g, function (s, p1) {
            return Mark.up("{{" + p1 + "}}", context);
        });
        testy = prop.trim().indexOf("if ") === 0;
        filters = prop.split("|").splice(1);
        prop = prop.replace(/^\s*if/, "").split("|").shift().trim();
        token = testy ? "if" : prop.split("|")[0];
        ctx = context[prop];

        // assume testing for empty
        if (testy && !filters.length) {
            filters = ["notempty"];
        }

        // determine the full extent of a block tag and its child
        if (!selfy && template.indexOf("{{/" + token) > -1) {
            result = this._bridge(template, token);
            tag = result[0];
            child = result[1];
            i += tag.match(re).length - 1; // fast forward
        }

        // skip "else" tags. these will be pulled out in _test()
        if (/^\{\{\s*else\s*\}\}$/.test(tag)) {
            continue;
        }

        // tag refers to a global
        else if ((global = this.globals[prop]) !== undefined) {
            result = this._eval(global, filters, child);
        }

        // tag refers to included template
        else if ((include = this.includes[prop])) {
            if (include instanceof Function) {
                include = include();
            }
            result = this._pipe(Mark.up(include, context), filters);
        }

        // tag refers to loop counter
        else if (prop.match(/#{1,2}/)) {
            options.iter.sign = prop;
            result = this._pipe(options.iter, filters);
        }

        // tag refers to current context
        else if (prop === ".") {
            result = this._pipe(context, filters);
        }

        // tag has dot notation, e.g. "a.b.c"
        else if (prop.match(/\./)) {
            prop = prop.split(".");
            ctx = Mark.globals[prop[0]];

            if (ctx) {
                j = 1;
            }
            else {
                j = 0;
                ctx = context;
            }

            // get the actual context
            while (j < prop.length) {
                ctx = ctx[prop[j++]];
            }

            result = this._eval(ctx, filters, child);
        }

        // tag is otherwise testable
        else if (testy) {
            result = this._pipe(ctx, filters);
        }

        // context is an array. loop through it
        else if (ctx instanceof Array) {
            result = this._eval(ctx, filters, child);
        }

        // tag is a block, e.g. {{foo}}child{{/foo}}
        else if (child) {
            result = ctx ? Mark.up(child, ctx) : undefined;
        }

        // else all others
        else if (context.hasOwnProperty(prop)) {
            result = this._pipe(ctx, filters);
        }

        // resolve "if" statements
        if (testy) {
            result = this._test(result, child, context, options);
        }

        // replace the tag, e.g. "{{name}}", with the result, e.g. "Adam"
        template = template.replace(tag, result === undefined ? "???" : result);
    }

    return this.compact ? template.replace(/>\s+</g, "><") : template;
};

// "out of the box" pipes. see README
Mark.pipes = {
    empty: function (obj) {
        return !obj || (obj + "").trim().length === 0 ? obj : false;
    },
    notempty: function (obj) {
        return obj && (obj + "").trim().length ? obj : false;
    },
    blank: function (str, val) {
        return !!str || str === 0 ? str : val;
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
        return new RegExp(pattern, "i").test(str) ? str : false;
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
    capcase: function (str) {
        return str.replace(/\b\w/g, function (s) { return s.toUpperCase(); });
    },
    chop: function (str, n) {
        return str.length > n ? str.substr(0, n) + "..." : str;
    },
    tease: function (str, n) {
        var a = str.split(/\s+/);
        return a.slice(0, n).join(" ") + (a.length > n ? "..." : "");
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
    clean: function (str) {
        return String(str).replace(/<\/?[^>]+>/gi, "");
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
    limit: function (arr, count, idx) {
        return arr.slice(+idx || 0, +count + (+idx || 0));
    },
    split: function (str, separator) {
        return str.split(separator || ",");
    },
    choose: function (bool, iffy, elsy) {
        return !!bool ? iffy : (elsy || "");
    },
    toggle: function (obj, csv1, csv2, str) {
        return csv2.split(",")[csv1.match(/\w+/g).indexOf(obj + "")] || str;
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
        Mark.globals[key] = obj; return "";
    }
};
