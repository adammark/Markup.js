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
    return url + (url.indexOf("?") > -1 ? "&" : "?") + "cache=" + Math.random();
};
