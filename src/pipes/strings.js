Mark.pipes.capcase = function (str) {
    var matches = str.match(/\w+/g) || [], m;
    while ((m = matches.shift())) {
        str = str.replace(m, m.substr(0, 1).toUpperCase() + m.substr(1));
    }
    return str;
};

Mark.pipes.repeat = function (str, count, separator) {
    var a = [];
    for (var i = 0, j = count || 2; i < j; i++) {
        a.push(str);
    }
    return a.join(separator || "");
};

Mark.pipes.bust = function (url) {
    return url + (url.indexOf("?") > -1 ? "&" : "?") + "cache=" + (+new Date());
};

Mark.pipes.breaklines = function (str) {
    return str.replace(/\n/g, "<br>");
};

Mark.pipes.linkify = function (str) {
    return str.replace(/\b(https?:[^\b\s]+)\b/g, "<a href=\"$1\">$1</a>");
};

Mark.pipes.address = function (addr) {
    return "<a href=\"http://maps.google.com/maps?q=" + encodeURI(addr) + ">" + addr + "</a>";
};
