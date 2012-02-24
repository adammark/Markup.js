/*
 * Display a number in "#,###.##" notation according to the given precision 
 * (number of decimal places) and with an optional "+" sign (if positive). 
 * precision defaults to 0; signed defaults to false.
 *
 * Examples:
 *
 * {{total_views|numberformat}}
 * {{percent_change|numberformat>2>true}}
 */
Mark.pipes.numberformat = function (num, precision, signed) {
    var m = (+num).toFixed(precision).match(/\d+/g),
        i = m[0].length % 3,
        d = m[1] ? "." + m[1] : "",
        a = i ? [m[0].slice(0, i)] : [],
        s = signed && num > 0 ? "+" : (num < 0) ? "-" : "";

    return s + a.concat(m[0].slice(i).match(/\d{3}/g) || []).join() + d;
};

/*
 * Format a number in dollars using Accounting.js.
 *
 * Requires Accounting.js: http://josscrowcroft.github.com/accounting.js/
 *
 * Example:
 *
 * {{price|dollars}}
 */
Mark.pipes.dollars = function (num) {
    return accounting.formatMoney(+num);
};

/*
 * Format a number in euros using Accounting.js.
 *
 * Requires Accounting.js: http://josscrowcroft.github.com/accounting.js/
 *
 * Example:
 *
 * {{price|euros}}
 */
Mark.pipes.euros = function (num) {
    return accounting.formatMoney(+num, "€", 2, ".", ",");
};

/*
 * Format a U.S. phone number string as "(###) ###-####".
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
 * Express a number as a percent, e.g. "123.45%". precision defaults to 0.
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
 * (seconds) or 1000 (milliseconds). factor defaults to 1.
 *
 * Examples:
 *
 * {{duration|runtime}}
 * {{duration|runtime>1000}}
 */
Mark.pipes.runtime = function (time, factor) {
    var m = Math.floor(time / (60 * (factor || 1)));
    var s = Math.floor((time / (factor || 1)) % 60);
    return m + ":" + ("00" + s).substr(-2);
};

/*
 * Add n to number.
 *
 * Example:
 *
 * {{age|plus>10}}
 */
Mark.pipes.plus = function (num, n) {
    return num + (+n);
};

/*
 * Subtract n from number
 *
 * Example:
 *
 * {{age|minus>10}}
 */
Mark.pipes.minus = function (num, n) {
    return num - (+n);
};

/*
 * Multiply number by n.
 *
 * Example:
 *
 * {{age|times>10}}
 */
Mark.pipes.times = function (num, n) {
    return num * (+n);
};