/*
 * Get a random entry from an array.
 */
Mark.pipes.rand = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

/*
 * Group an array of objects according to a given property. Returns an array
 * of objects, each having a "key" (string) and "items" (array).
 *
 * Example:
 *
 * {{results|groupby>state}}
 *     <h1>{{key}}</h1>
 *     <ul>
 *        {{items}}
 *            <li>{{zip}}</li>
 *        {{/items}}
 *     </ul>
 * {{/results}}
 */
Mark.pipes.groupby = function (arr, key) {
    var a = [], b = [], i, j, k;

    for (i in arr) {
        j = arr[i][key];
        if (a.indexOf(j) === -1) {
            a.push(j);
            b.push({ items:[] });
        }
    }

    for (i in arr) {
        j = arr[i][key];
        k = a.indexOf(j);
        b[k].key = j;
        b[k].items.push(arr[i]);
    }

    return b;
};
