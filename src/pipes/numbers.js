/*
 * Format a number in dollar notation.
 *
 * Example:
 *
 * {{price|dollars}}
 */
Mark.pipes.dollars = function (num) {
    var n = (+num).toFixed(2).toString(), i = n.indexOf(".");
    while ((i -= 3) > 0) {
        n = n.substr(0, i) + "," + n.substr(i);
    }
    return "$" + n;
};

/*
 * Format a number in euros.
 *
 * Example:
 *
 * {{price|euros}}
 */
Mark.pipes.euros = function (num) {
    var n = (+num).toFixed(2).toString(), i = n.indexOf(".");
    while ((i -= 3) > 0) {
        n = n.substr(0, i) + "." + n.substr(i);
    }
    return n.replace(/\.(\d{2})$/, ",$1") + " \u20AC";
};

/*
 * Format a U.S. phone number string as "(123) 456-7890".
 *
 * Example:
 *
 * {{mobile_phone|phone}}
 */
Mark.pipes.phone = function (str) {
    var s = str.replace(/[^\d]/g, "");
    return "(" + s.substr(0, 3) + ") " + s.substr(3, 3) + "-" + s.substr(6, 4);
};

/*
 * Express a number as an ordinal, e.g. "10th".
 *
 * Example:
 *
 * {{contestant.standing|ordinal}}
 */
Mark.pipes.ordinal = function (num) {
    if (num > 10 && num < 20) {
        return num + "th";
    }
    return num + ["th","st","nd","rd","th","th","th","th","th","th"][num % 10];
};

/*
 * Express a number as a percent, e.g. "123.45%". Precision defaults to 0.
 *
 * Examples:
 *
 * {{market_share|percent}}
 * {{price_change|percent>2}}
 */
Mark.pipes.percent = function (num, precision) {
    return (num < 1 ? num * 100 : num).toFixed(precision || 0) + "%";
};

/*
 * Convert a number to stopwatch notation ("mm:ss"), given a factor of 1
 * (seconds) or 1000 (milliseconds). (factor defaults to 1)
 *
 * Example:
 *
 * {{duration||runtime>1000}}
 *
 */
Mark.pipes.runtime = function (time, factor) {
    var m = Math.floor(time / (60 * (factor || 1)));
    var s = Math.floor((time / (factor || 1)) % 60);
    return m + ":" + ("00" + s).substr(-2);
};
