/*
 * Determine if an array contains an object with the given property value.
 *
 * Example:
 *
 * {{if fruits|has>color>red}}
 *    ...
 * {{/if}}
 */
Mark.pipes.has = function (arr, prop, val) {
    return arr.some(function (item) {
        return item[prop] == val;
    });
};

/*
 * Reduce an array to objects with the given property value.
 *
 * Example:
 *
 * <ul>
 *     {{fruits|sift>color>red}}
 *         <li>{{fruit.name}}</li>
 *     {{/fruits}}
 * </ul>
 */
Mark.pipes.sift = function (arr, prop, val) {
    return arr.filter(function (item) {
        return item[prop] == val;
    });
};

/*
 * Shuffle and reduce an array to n random entries. (n defaults to 1)
 *
 * Example:
 *
 * <ul>
 *     {{users|rand>5}}
 *         <li>{{lastname}}, {{firstname}}</li>
 *     {{/users}}
 * </ul>
 */
Mark.pipes.rand = function (arr, n) {
    var copy = Mark._copy(arr).sort(function (a, b) {
        return Math.random() > 0.5 ? 1 : -1;
    });

    return copy.slice(0, n || 1);
};

/*
 * Group an array of objects according to a given property. Returns an array
 * of objects, each having a "key" (string) and "items" (array).
 *
 * Example:
 *
 * {{offices|groupby>state}}
 *     <h1>Offices in {{key}}</h1>
 *     <ul>
 *        {{items}}
 *            <li>{{street}}</li>
 *        {{/items}}
 *     </ul>
 * {{/offices}}
 */
Mark.pipes.groupby = function (arr, prop) {
    var a = [], b = [], i, j, k;

    for (i = 0; i < arr.length; i++) {
        j = arr[i][prop];
        if (a.indexOf(j) === -1) {
            a.push(j);
            b.push({ items:[] });
        }
    }

    for (i = 0; i < arr.length; i++) {
        j = arr[i][prop];
        k = a.indexOf(j);
        b[k].key = j;
        b[k].items.push(arr[i]);
    }

    return b;
};

/*
 * Group an array of objects alphabetically by the given property. Returns
 * an array of objects, each having a "key" (letter of the alphabet) and
 * "items" (an array of objects in alphabetical order).
 *
 * Example:
 *
 * {{contacts|alpha>lastname}}
 *     <h1>{{key}}</h1>
 *     <ul>
 *        {{items}}
 *            <li>{{lastname}}, {{firstname}}</li>
 *        {{/items}}
 *     </ul>
 * {{/contacts}}
 */
Mark.pipes.alpha = function (arr, prop) {
    var a = [], b = "", i, j;

    for (i = 0; i < arr.length; i++) {
        j = arr[i][prop].charAt(0).toUpperCase();

        if (b.indexOf(j) === -1) {
            b += j;
            a[b.indexOf(j)] = { key: j, items: [] };
        }

        a[b.indexOf(j)].items.push(arr[i]);
    }

    for (i = 0; i < a.length; i++) {
        a[i].items.sort(function (a, b) {
            return a[prop] > b[prop] ? 1 : -1;
        });
    }

    return a;
};
