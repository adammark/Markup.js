/*
 * Perform a switch statement on a number or string.
 *
 * Number example:
 * {{apples|cases>0,1,2>No apples,One apple,Two apples}}
 *
 * String example:
 * {{error|cases>NOT_FOUND,GENERAL>File not found,Unknown Error}}
 *
 * Providing a fallback value:
 * {{gender|cases>M,F>Male,Female>Unknown}}
 */
Mark.pipes.cases = function (num, a, b, c) {
    return b.split(",")[a.match(/\w+/g).indexOf(num.toString())] || c;
};
