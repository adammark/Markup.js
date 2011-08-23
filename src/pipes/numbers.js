Mark.pipes.dollars = function (num) {
    var n = num.toFixed(2).toString(), i = n.indexOf(".");
    while ((i -= 3) > 0) {
        n = n.substr(0, i) + "," + n.substr(i);
    }
    return "$" + n;
};

Mark.pipes.phone = function (str) {
    var s = str.replace(/[^\d]/g, "");
    return "(" + s.substr(0, 3) + ") " + s.substr(3, 3) + "-" + s.substr(6, 4);
};

Mark.pipes.ordinal = function (num) {
    if (num > 10 && num < 20) {
        return num + "th";
    }
    return num + ["th","st","nd","rd","th","th","th","th","th","th"][num % 10];
};

Mark.pipes.percent = function (num, precision) {
    return (num < 1 ? num * 100 : num).toFixed(precision || 0) + "%";
};
