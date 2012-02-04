/*
 * Perform a switch statement on a number or string.
 *
 * Number example:
 * {{apples|select>0,1,2>No apples,One apple,Two apples}}
 *
 * String example:
 * {{error|select>NOT_FOUND,GENERAL>File not found,Unknown Error}}
 *
 * Providing a fallback value:
 * {{gender|select>M,F>Male,Female>Unknown}}
 */
Mark.pipes.select = function (obj, a, b, c) {
    return b.split(",")[a.match(/\w+/g).indexOf(obj.toString())] || c;
};
