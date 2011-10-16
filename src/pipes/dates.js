/*
 * See http://php.net/manual/en/function.date.php
 * Supported date codes: D l n m M F j d Y y
 * Supported time codes: g G i a A
 */
Mark.pipes.datetime = function (date, format) {
    if (typeof date === "string") {
        date = new Date(date);
    }

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

    return (format || "l, F j, Y g:i a")
        .replace(/(\w)/g, "%$1%")
        .replace(/%g%/, (G % 12) || 12)
        .replace(/%G%/, G)
        .replace(/%i%/, i)
        .replace(/%a%/, G < 12 ? "a.m." : "p.m.")
        .replace(/%A%/, G < 12 ? "A.M." : "P.M.")
        .replace(/%D%/, l.substr(0, 3))
        .replace(/%l%/, l)
        .replace(/%n%/, date.getMonth() + 1)
        .replace(/%m%/, ("0" + (date.getMonth() + 1)).substr(-2))
        .replace(/%M%/, F.substr(0, 3))
        .replace(/%F%/, F)
        .replace(/%j%/, j)
        .replace(/%d%/, ("0" + j).substr(-2))
        .replace(/%Y%/, Y)
        .replace(/%y%/, Y.toString().substr(-2));
};

Mark.pipes.timeago = function (date) {
    if (typeof date === "string") {
        date = new Date(date);
    }

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
