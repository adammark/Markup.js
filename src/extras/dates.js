/*
 * Express a date in the user's local format.
 *
 * Example:
 *
 * {{created_at|date}}
 */
Mark.pipes.date = function (date) {
    return new Date(+date || date).toLocaleDateString();
};

/*
 * Express a time in the user's local format.
 *
 * Example:
 *
 * {{created_at|time}}
 */
Mark.pipes.time = function (date) {
    return new Date(+date || date).toLocaleTimeString();
};

/*
 * Express a date and time in the user's local format.
 *
 * Example:
 *
 * {{created_at|datetime}}
 */
Mark.pipes.datetime = function (date) {
    return new Date(+date || date).toLocaleString();
};

/*
 * Format a date using Moment.js.
 *
 * Requires Moment.js: http://momentjs.com/
 *
 * Example:
 *
 * {{created_at|moment>M/D/YYYY}}
 */
Mark.pipes.moment = function (date, format) {
    return moment(new Date(+date || date)).format(format);
};

/*
 * Express a time difference using Moment.js, e.g. "10 minutes ago"
 *
 * Requires Moment.js: http://momentjs.com/
 *
 * Example:
 *
 * {{created_at|fromnow}}
 */
Mark.pipes.fromnow = function (date) {
    return moment(new Date(+date || date)).fromNow();
};

/*
 * Format a date in English.
 * See http://php.net/manual/en/function.date.php
 *
 * Supported date codes: D l n m M F j d Y y
 * Supported time codes: g G i a A
 *
 * Default format: "l, F j, Y g:i a"
 *
 * Example:
 *
 * {{published|datetime>n/j/Y g:i a}}
 */
Mark.pipes.datetime = function (date, format) {
    date = new Date(+date || date);

    format = format || "l, F j, Y g:i a";

    var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var G = date.getHours();
    var i = ("0" + date.getMinutes()).substr(-2);
    var l = days[date.getDay()];
    var F = months[date.getMonth()];
    var j = date.getDate();
    var Y = date.getFullYear();

    return format.replace(/[a-z]/gi, function (str) {
        return {
            "g": (G % 12) || 12,
            "G": G,
            "i": i,
            "a": G < 12 ? "a.m." : "p.m.",
            "A": G < 12 ? "A.M." : "P.M.",
            "D": l.substr(0, 3),
            "l": l,
            "n": date.getMonth() + 1,
            "m": ("0" + (date.getMonth() + 1)).substr(-2),
            "M": F.substr(0, 3),
            "F": F,
            "j": j,
            "d": ("0" + j).substr(-2),
            "Y": Y,
            "y": Y.toString().substr(-2)
        }[str];
    });
};
