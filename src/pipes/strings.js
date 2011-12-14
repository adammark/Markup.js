/*
 * Capitalize the first character in each word.
 *
 * Example:
 *
 * {{title|capcase}}
 */
Mark.pipes.capcase = function (str) {
    return str.replace(/\b(\w+)\b/g, function($1) { return $1.capitalize(); } );
};

/*
 * Repeat a string. Count defaults to 2; separator defaults to "".
 *
 * Example:
 *
 * {{chorus|repeat>5}}
 */
Mark.pipes.repeat = function (str, count, separator) {
    var a = [];
    for (var i = 0, j = count || 2; i < j; i++) {
        a.push(str);
    }
    return a.join(separator || "");
};

/*
 * Add a cache buster to a URL.
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
 * is a templating function in itself.
 */
Mark.pipes.inject = function (str) {
    var matches = str.match(/\[\d+\]/g) || [], m;

    while ((m = matches.shift())) {
        str = str.replace(m, arguments[1 + parseInt(m.substr(1))] || "");
    }

    return str;
};
