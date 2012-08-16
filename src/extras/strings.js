/*
 * Escape HTML in the input string.
 *
 * Example:
 *
 * {{comment|sanitize}}
 */
Mark.pipes.sanitize = function (str) {
    var input = "<>&\"'\/";
    var output = ["&lt;", "&gt;", "&amp;", "&quot;", "&#39;", "&#x2F;"];

    return str.replace(new RegExp(input, "g"), function (s) {
        return output[input.indexOf(s)];
    });
};

/*
 * Capitalize the first character in each word, excluding some articles and
 * prepositions.
 *
 * Example:
 *
 * {{title|headline}}
 */
Mark.pipes.headline = function (str) {
    var exclude = "a,an,the,for,to,of,on,as,in,and,from".split(",");

    return str.replace(/\b\w+/g, function (s, i) {
        if (exclude.indexOf(s) > -1 && i > 0) {
            return s;
        }
        return s.charAt(0).toUpperCase() + s.slice(1);
    });
};

/*
 * Repeat a string. Count defaults to 2; separator defaults to "".
 *
 * Example:
 *
 * {{chorus|repeat>5}}
 */
Mark.pipes.repeat = function (str, count, separator) {
    return new Array(+count || 2).join(str + (separator || "")) + str;
};

/*
 * Add a cache buster (unique value) to a URL.
 *
 * Example:
 *
 * {{url|bust}}
 */
Mark.pipes.bust = function (url) {
    return url + (url.indexOf("?") > -1 ? "&" : "?") + "cache=" + (+new Date());
};

/*
 * Replace all line break characters (\n) with <br>.
 *
 * Example:
 *
 * {{comment|breaklines}}
 */
Mark.pipes.breaklines = function (str) {
    return str.replace(/\n/g, "<br>");
};

/*
 * Wrap text blocks (delimited by line breaks) in <p>...</p>.
 *
 * Example:
 *
 * {{content|clean|grafs}}
 */
Mark.pipes.grafs = function (str) {
    return str.replace(/(.+)/g, function (s, p1) {
        return "<p>" + p1 + "</p>";
    });
};

/*
 * Wrap all URLs in links.
 *
 * Example:
 *
 * {{story|links}}
 */
Mark.pipes.links = function (str) {
    return str.replace(/\b(https?:[^\b\s]+)\b/g, "<a href=\"$1\">$1</a>");
};

/*
 * Link all screen names in a tweet.
 *
 * Examples:
 *
 * {{text|tweet}}
 * {{text|links|tweet}}
 */
Mark.pipes.tweet = function (str) {
    return str.replace(/(@\w+)/g, "<a href=\"http://twitter.com/#!/$1\">$1</a>");
};

/*
 * Wrap an address in a Google Maps link.
 *
 * Example:
 *
 * {{home_addr|address}}
 */
Mark.pipes.address = function (addr) {
    return "<a href=\"http://maps.google.com/maps?q=" + encodeURI(addr) + ">" + addr + "</a>";
};

/*
 * Inject values into string with numeric tokens, e.g. "a=[0]&b=[1]". This is
 * a templating function in itself.
 *
 * Example:
 *
 * {{display_url|inject>100>date>desc}}
 */
Mark.pipes.inject = function (str) {
    var args = arguments;

    return str.replace(/\[(\d+)\]/g, function (s, i) {
        return args[+i + 1] || "";
    });
};

/*
 * Highlight a pattern throughout a string.
 *
 * Example:
 *
 * {{article|highlight>`searchTerm`}}
 */
Mark.pipes.highlight = function (str, pattern) {
    return str.replace(new RegExp("(" + pattern + ")", "g"), "<em>$1</em>");
};
