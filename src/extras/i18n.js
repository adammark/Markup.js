/*
 * Select part of a string delimited by ";;", where n is a number to be
 * evaluated by a pluralization function. See README.md for implementation
 * details.
 *
 * Example:
 *
 * {{apple_msg|pluralize>`apples`}}
 */
Mark.pipes.pluralize = function (str, n) {
    // pluralization functions for each language you support
    var plurals = {
        "en": function (msgs, n) {
            return msgs[n === 1 ? 0 : 1];
        }
    };

    // the user's language. you can replace this with your own code
    var lang = (navigator.language || navigator.userLanguage).split("-")[0];

    // fall back to English
    if (!plurals[lang]) {
        lang = "en";
    }

    // get the result string
    return plurals[lang](str.split(";;"), +n).trim();
};
