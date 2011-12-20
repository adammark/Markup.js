/*
 * Capitalize the first character in each word.
 *
 * Example:
 *
 * {{title|capcase}}
 */
Mark.pipes.capcase = function (str) {
    return str.replace(/\b(\w)/g, function ($1) { return $1.toUpperCase(); });
};

/*
 * Repeat a string. Count defaults to 2; separator defaults to "".
 *
 * Example:
 *
 * {{chorus|repeat>5}}
 */
Mark.pipes.repeat = function (str, count, separator) {
    return new Array(count || 2).join(str + (separator || "")) + str;
};

/*
 * Get the first n words of a string. (words defaults to 25)
 *
 * Example:
 *
 * {{article|tease>30}}
 */
Mark.pipes.tease = function (str, words) {
    return str.split(/\s+/).slice(0, words || 25).join(" ") + "...";
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
 */
Mark.pipes.inject = function (str) {
    var matches = str.match(/\[\d+\]/g) || [], m;

    while ((m = matches.shift())) {
        str = str.replace(m, arguments[1 + parseInt(m.substr(1))] || "");
    }

    return str;
};
