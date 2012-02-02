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
 * Apply custom formatting to a date. (English)
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
Mark.pipes.formatdate = function (date, format) {
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

/*
 * Express a date in "... minutes ago" notation. (English)
 *
 * Example:
 *
 * {{created_at|timeago}}
 */
Mark.pipes.timeago = function (date) {
    date = new Date(+date || date);

    var result = "";
    var diff = new Date().getTime() - date.getTime();
    var h = Math.floor(diff / 3600000);
    var to_s = function (n, label) {
        n = Math.floor(n);
        return n + " " + label + (n > 1 ? "s" : "") + " ago";
    };

    if (h === 0) {
        h = Math.floor(diff / 60000);
        result = h < 2 ? "Just now" : to_s(h, "minute");
    } else if (h < 24) {
        result = to_s(h, "hour");
    } else if (h < 168) {
        result = to_s(h / 24, "day");
    } else if (h < 744) {
        result = to_s(h / 168, "week");
    } else {
        result = to_s(h / 744, "month");
    }

    return result;
};
