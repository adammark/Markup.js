# Markup.js — Powerful JavaScript templates

Markup.js is a simple yet surprisingly powerful template system for
JavaScript.

## Why Markup.js?

Markup.js takes the pain out of converting structured data into HTML
markup or other text formats. Its intuitive syntax and small footprint
(only 1.7KB minified and gzipped) make it the perfect choice for your
Javascript app. Plus there are *no dependencies.*

## Usage

Include `<script src="markup.min.js"></script>`.

Markup.js has a single function: `Mark.up(template, context)`. Here's a
basic example that shows how `template`, a string, is injected with
properties of `context`, an object:

``` javascript
var context = {
    name: {
        first: "John",
        last: "Doe"
    }
};

var template = "Hi, {{name.first}}!";

var result = Mark.up(template, context); // "Hi, John!"
```

You can format any kind of objects, including Functions with exposed
properties:

``` javascript
var context = {
    person: new Person("Adam")
};

var template = "Hi, {{person.name}}!";

var result = Mark.up(template, context); // "Hi, Adam!"
```

## Object notation

You can access object properties with simple dot notation:

``` javascript
var context = {
    name: "John Doe",
    addr: {
        street: "1 Maple Street",
        city: "Pleasantville",
        zip: {
            main: "12345",
            ext: "6789"
        }
    }
};

var template = "{{name}} lives on {{addr.street}} in {{addr.city}}.";

var result = Mark.up(template, context);
// "John Doe lives on 1 Maple Street in Pleasantville."
```

Or you can use nested tags:

``` javascript
var template = "{{name}} lives on {{addr}}{{street}} in {{city}}.{{/addr}}";

var result = Mark.up(template, context);
// "John Doe lives on 1 Maple Street in Pleasantville."
```

Or you can use a combination of nested tags and dot notation:

``` javascript
var template = "ZIP: {{addr}}{{zip.main}}-{{zip.ext}}{{/addr}}";

var result = Mark.up(template, context);
// "ZIP: 12345-6789"
```

## Array notation

Array members can be accessed by index. For example:

``` javascript
var context = {
    name: "John Doe",
    colors: ["Red", "Blue", "Green"]
};

var template = "Favorite color: {{colors.0}}";

var result = Mark.up(template, context);
// "Favorite color: Red"
```

You can mix array index notation and object property notation in the
same expression:

``` javascript
var context = {
    name: "John Doe",
    friends: [{name: "Bob"}, {name: "Fred"}]
};

var template = "Best friend: {{friends.0.name}}";

var result = Mark.up(template, context);
// "Best friend: Bob"
```

## Loops

If a tag resolves to an array, the array is iterated. A single dot
refers to the current iteration context:

``` javascript
var context = {
    name: "John Doe",
    brothers: ["Jack", "Joe", "Jim"]
};

var template = "<ul>{{brothers}}<li>{{.}}</li>{{/brothers}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>Jack</li><li>Joe</li><li>Jim</li></ul>"
```
When looping through an array of objects, object properties can be
referenced by name:

``` javascript
var context = {
    name: "John Doe",
    sisters: [{name: "Jill"}, {name: "Jen"}]
};

var template = "<ul>{{sisters}}<li>{{name}}</li>{{/sisters}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>Jill</li><li>Jen</li></ul>"
```

Dot notation works inside loops as well:

``` javascript
var context = {
    sisters: [
        {name: {first: "Jill", last: "Doe"}},
        {name: {first: "Jen", last: "Doe"}}
    ]
};

var template = "<ul>{{sisters}}<li>{{name.first}}</li>{{/sisters}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>Jill</li><li>Jen</li></ul>"
```

### Loop counters

Inside a loop, a single hash sign refers to the current iteration index
(0...n) and a double hash sign refers to the current iteration count
(1...n):

``` javascript
var template = "{{sisters}} {{#}}-{{name.first}} {{/sisters}}";
// " 0-Jill  1-Jen "
```

``` javascript
var template = "{{sisters}} {{##}}-{{name.first}} {{/sisters}}";
// " 1-Jill  2-Jen "
```

This is useful for applying conditional formatting, as described below,
and for creating numbered lists.

## Pipes

Pipes are a powerful way to transform variables. Here's a simple example:

``` javascript
var context = {
    name: "John Doe",
    alias: " J-Do ",
    phone: null,
    gender: "male",
    age: 33.33,
    vitals: [68, 162.5, "AB"],
    brothers: ["Jack", "Joe", "Jim"],
    sisters: [{name: "Jill"}, {name: "Jen"}],
    jiggy: true
};

var template = "Name: {{name|upcase}}";

var result = Mark.up(template, context);
// "Name: JOHN DOE"
```

A pipe can accept arguments. For example, the `blank` pipe accepts a
value to display if the piped input is *null*, *false* or *undefined*:

``` javascript
var template = "Phone: {{phone|blank>N/A}}";

var result = Mark.up(template, context);
// "Phone: N/A"
```

The `choose` pipe accepts two strings and returns one of them depending
on whether the piped input is true or false:

``` javascript
var template = "John is jiggy: {{jiggy|choose>Yes>No}}";

var result = Mark.up(template, context);
// "John is jiggy: Yes"
```

Pipes can be applied to any kind of data structure:

``` javascript
// get the second value in an array and round it
var template = "Weight: {{vitals.1|round}} lbs.";

var result = Mark.up(template, context);
// "Weight: 163 lbs."
```

``` javascript
// sort an array of strings, then upcase each string
var template = "<ul>{{brothers|sort}}<li>{{.|upcase}}</li>{{/brothers}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>JACK</li><li>JIM</li><li>JOE</li></ul>"
```

``` javascript
// reverse an array of objects, then chop each name property
var template = "<ul>{{sisters|reverse}}<li>{{name|chop>2}}</li>{{/sisters}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>Je...</li><li>Ji...</li></ul>"
```

### Chaining pipes

Variables can be passed through multiple pipes. Here are two simple
examples:

``` javascript
var template = "Alias: {{alias|trim|downcase}}";

var result = Mark.up(template, context);
// "Alias: j-do"
```

``` javascript
var template = "Age: {{age|more>75|choose>Oldish>Youngish}}";

var result = Mark.up(template, context);
// "Age: Youngish"
```

You can get very creative with pipes:

``` javascript
var template = "Bros: {{brothers|sort|limit>2|join> & }}";

var result = Mark.up(template, context);
// "Bros: Jack & Jim"
```

### Built-in pipes

Markup.js comes with more than 40 built-in pipes. Below, the first
argument is always the piped value itself:

`empty` (obj): returns obj if empty, else returns false

`notempty` (obj): returns obj if notempty, else returns false

`more` (a, b): returns a if a > b, else returns false

`less` (a, b): returns a if a < b, else returns false

`ormore` (a, b): returns a if a >= b, else returns false

`orless` (a, b): returns a if a <= b, else returns false

`between` (a, b, c): returns a if a is between b and c, inclusive, else returns false

`equals` (a, b): returns a if a == b, else returns false

`notequals` (a, b): returns a if a != b, else returns false

`blank` (str, val): returns val if str is false/null/undefined, else returns str

`like` (str, pattern): returns str if regex pattern matches str, else returns false

`notlike` (str, pattern): returns str if regex pattern does not match str, else returns false

`upcase` (str): returns str upper-cased

`downcase` (str): returns str down-cased

`chop` (str, n): chops str to n chars followed by "..." if n > str.length

`trim` (str): returns str with leading and trailing white space removed

`pack` (str): returns str with white space trimmed and normalized

`round` (num): returns num rounded

`style` (str, classes): returns `<span class="classes">str</span>`

`clean` (str): returns str with HTML tags removed

`sub` (str, pattern, replacement): returns str with all instances of pattern replaced

`length` (obj): returns length of string or array

`size` (obj): alias to `length`

`reverse` (arr): returns arr reversed

`join` (arr, separator): returns arr joined by separator

`limit` (arr, count): returns the first count elements of arr

`slice` (arr, start, length): returns a slice of arr (start to start+length)

`split` (str, separator): returns a string split by separator

`choose` (bool, iffy, elsy): returns iffy if bool is true, else returns elsy

`sort` (arr, prop): returns arr sorted. optionally sort by property prop 

`fix` (num, n): returns num formatted to n decimal places

`mod` (num, n): returns num % n

`divisible` (num, n): returns num if num % n === 0, else returns false

`even` (num): returns num if num is even, else returns false

`odd` (num): returns num if num is odd, else returns false

`number` (str): returns number from str, e.g. "$1,234.56" > 1234.56 or "30px" > 30

`url` (str): returns URL-encoded str

`bool` (obj): casts obj to boolean, returning true or false

`falsy` (obj): returns true if false, else returns false

`first` (iter): returns true if iterator (# or ##) is the first item, else returns false

`last` (iter): returns true if iterator (# or ##) is the last item, else returns false

`call` (obj, fn, arg1, arg2...): power pipe! calls fn on obj with zero or more args

*Note: Arrays are copied before sorting or slicing.*

### Power pipe

With great power comes great responsibility.  Thus the `call` pipe,
which allows you to call a function on any object and pass it zero or
more arguments:

``` javascript
var context = {
    num: 1.23
};

var template = "{{num|call>toPrecision>5}}";

var result = Mark.up(template, context);
// "1.2300"
```

``` javascript
function Dog() {
    var greeting = "Woof!";

    this.bark = function (times) {
        ...
    };
}

var context = {
    doggy: new Dog()
};

var template = "{{doggy|call>bark>3}}";

var result = Mark.up(template, context);
// "Woof! Woof! Woof!"
```

### Writing custom pipes

You can add your own pipes to Markup.js. The first argument is the piped
value and any subsequent arguments are strings. For example:

``` javascript
Mark.pipes.repeat = function (str, count, separator) {
    var a = [];
    for (var i = 0, j = count || 2; i < j; i++) {
        a.push(str);
    }
    return a.join(separator || "");
};

var template = "{{name|repeat>3>, }}!";

var result = Mark.up(template, {name:"Beetlejuice"});
// "Beetlejuice, Beetlejuice, Beetlejuice!"

```

If you prefer, you can pass pipes into the optional `options` argument
of `Mark.up`:

``` javascript
var options = {
    pipes: {
        mypipe: function (str) { ... }
    }
};

var result = Mark.up(template, context, options);
```

Note! All pipe arguments are passed as strings. For example, in the
expression `{{num|add>23>45}}`, "23" and "45" are strings. Therefore,
you should cast data types as necessary in your custom pipes:

``` javascript
// WRONG! 1 + "23" + "45" returns "12345"
Mark.pipes.add = function (a, b, c) {
    return a + b + c;
};

// RIGHT! 1 + "23" + "45" returns 69
Mark.pipes.add = function (a, b, c) {
    return a + parseInt(b) + parseInt(c);
};
```

### More pipes!

Additional pipes are available in `src/pipes` for your piping pleasure. 
(These are not included in markup.js.)

## IF and IF/ELSE statements

IF statements are formatted as `{{if expression}} ... {{/if}}`, where
*expression* is a boolean test with optional pipes:

``` javascript
var template = "{{if brothers|notempty}} John has {{brothers|size}} brothers! {{/if}}"
```

``` javascript
var template = "{{if children|empty}} John has no kids. {{/if}}"
```

``` javascript
var template = "{{if age|more>75}} John is a ripe old {{age|round}}! {{/if}}"
```

``` javascript
var template = "{{if age|between>50>75}} John is middle aged. {{/if}}"
```

IF/ELSE statements work as you would expect:

``` javascript
var template = "{{if speed|more>65}} Too fast! {{else}} Too slow! {{/if}}"
```

Pipes can be chained in IF statements, allowing for arbitrarily complex
AND expressions:

``` javascript
// test if weight in kgs is greater than 500
var template = "{{if weight|kgs|more>500}} Lighten up! {{/if}}"
```

IF and IF/ELSE statements work the same way inside loops:

``` javascript
// show only users with email addresses
var template = "{{users}} {{if email}} ... {{/if}} {{/users}}";
```

IF and IF/ELSE statements can be nested:

``` javascript
var template = "{{if age|more>100}} {{if gender|equals>male}} Old man! {{/if}} {{/if}}";
```

``` javascript
var template = "{{if ...}} ... {{else}} {if ...}} ... {{else}} ... {{/if}} {{/if}}";
```

### Testing loop counters

You can use loop counters to apply conditional formatting:

``` javascript
// show different content in even and odd rows
var template = "{{users}} {{if #|even}} ... {{else}} ... {{/if}} {{/users}}";
```

``` javascript
// print a table header every five rows starting at zero
var template = "{{users}} {{if #|divisible>5}} <thead>...</thead> {{/if}} ... {{/users}}";
```

``` javascript
// print a table header every three rows after the tenth row
var template = "{{users}} {{if ##|more>10|divisible>3}} <thead>...</thead> {{/if}} ... {{/users}}";
```

``` javascript
// do something on the first pass
var template = "{{users}} {{if #|first}} ... {{/if}} ... {{/users}}";
```

### Custom pipes in conditional expressions

Custom pipes used in boolean tests should return either the piped value
(if true) or *false* (if false), such that the output of one pipe can
serve as the input to another. For example:

``` javascript
Mark.pipes.big = function (num) {
    return num > 1000000 ? num : false;
};

var context = { salary: 5000000 };

var template = "{{if salary|big|even}} A nice round number! {{/if}}";

```

## Includes

You can include templates inside other templates. For example:

``` javascript
Mark.includes.greeting = "My name is {{name|upcase}}!";

var template = "Hello! {{greeting}}";

var result = Mark.up(template, context);
// "Hello! My name is JOHN DOE!"
```

You can even pipe the output of an included template:

``` javascript
var template = "Hello! {{greeting|upcase}}";

var result = Mark.up(template, context);
// "Hello! MY NAME IS JOHN DOE!"
```

As with custom pipes, includes can be passed into the optional `options`
argument of `Mark.up`:

``` javascript
var options = {
    pipes: {
        repeat: function () { ... }
    },
    includes: {
        header: "<div> ... </div>",
        footer: "<div> ... </div>"
    }
};

var result = Mark.up(template, context, options);
```

*Be careful to avoid naming conflicts with `context` variables.*

## Implementation

HTML templates tend to be longer than the examples shown here, so it's a
good idea to segregate them from the rest of your code. In small apps,
you can put all your templates into a single file:

``` javascript
// templates.js
myapp.templates = {
    user_details: "<div> ... </div>",
    user_sidebar: "<div> ... </div>"
};
```

In big apps, you can split up your templates by functional area:

``` javascript
// templates-registration.js
myapp.templates.registration = {
    reg_intro: "<div> ... </div>",
    reg_error: "<div> ... </div>"
};

// templates-cart.js
myapp.templates.cart = {
    cart_proceed: "<div> ... </div>",
    cart_cancel: "<div> ... </div>"
};
```

You can use jQuery to inject an evaluated template into a document
element:

``` javascript
var template = myapp.templates.user_sidebar;

var context = user.data;

$("#sidebar").html(Mark.up(template, context));
```

Or, without jQuery:

``` javascript
document.getElementById("sidebar").innerHTML = Mark.up(template, context);
```

### Loading templates with AJAX

Large chunks of HTML can be cumbersome to write as JavaScript strings.
To get around this, you can write your templates in plain text files
and load them via AJAX. Here's how to do it with jQuery:

``` javascript
$.get("templates/sidebar.txt", function (txt) {
    // do stuff
});
```

To reduce the number of network requests, you could concatenate multiple
templates into a single file:

```
>>> user_detail
<div class="user-details">
    ...
</div>

>>> user_profile
<div class="user-profile">
    ...
</div>
```

``` javascript
var templates = {};

$.get("user-templates.txt", function (txt) {
    txt = txt.split(">>>").splice(1);
 
    for (var t in txt) {
        var i = txt[t].indexOf("\n");
        var key = txt[t].substr(0, i).trim();
        var val = txt[t].substr(i).trim();
        templates[key] = val;
    }
});
```

The right strategy depends on many factors, including the speed of your
app, the number of templates you're handling, and the cumulative weight
of the templates. 

### i18n

Markup.js can help support internationalization of your UI. Here's a
basic approach to creating a resource "bundle" for each target language:

``` javascript
// templates.en.js
myapp.templates = {
    hello: "Welcome, {{user.name}}.",
    goodbye: "Bye, {{user.name}}."
};
```

``` javascript
// templates.es.js
myapp.templates = {
    hello: "Hola, {{user.name}}.",
    goodbye: "Adios, {{user.name}}."
};
```

You can load the appropriate bundle with a <a
href="http://yepnopejs.com/">conditional script loader</a> or other
mechanism.

For simple apps, it might be easier to include all the strings in a
single data structure:

``` javascript
// templates.js
myapp.templates = {
    hello: {
        en: "Welcome, {{user.name}}!",
        es: "Hola, {{user.name}}!"
    },
    goodbye: {
        en: "Bye, {{user.name}}!",
        es: "Adios, {{user.name}}!"
    }
};
```

``` javascript
var template = myapp.templates.hello[LANG];
```

If you use Markup.js for both HTML composition *and* translation, you
might benefit from using includes. Here's one way to go about it:

``` javascript
// english resource bundle
var bundle = {
    hello_msg: "Welcome, {{user.name}}.",
    goodbye_msg: "See ya!"
};

// html templates
var templates = {
    hello_tpl: "<div class='hello'>{{hello_msg}}</div>",
    goodbye_tpl: "<div class='goodbye'>{{goodbye_msg}}</div>"
};

// context object
var context = {
    user: { name: "Adam" }
};

var hello_html = Mark.up(templates.hello_tpl, context, {includes: bundle});
// "<div class='hello'>Welcome, Adam.</div>"

var goodbye_html = Mark.up(templates.goodbye_tpl);
// "<div class='goodbye'>See ya!</div>"

```

Notice the last example requires neither a context object (since
`goodbye_msg` contains no variables) nor options (since they were set in
the previous function call).

*Internationalization requires careful design, especially when dealing
with context-sensitive strings. In the above example, `hello_msg`
expects to receive a `user` object.*

## Compatibility

TODO Chrome 13+, Safari 5+, etc.

## License

Copyright (C) 2011 by Adam Mark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
