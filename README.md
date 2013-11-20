# Markup.js — Powerful JavaScript templates

Markup.js is a simple yet surprisingly powerful template system for
JavaScript.

## Why Markup.js?

Markup.js takes the pain out of converting structured data into HTML markup or
other text formats. Its intuitive syntax and small footprint (only 1.9KB
minified and gzipped) make it the perfect choice for your JavaScript app. Plus
there are *no dependencies.*

## Usage

Include `<script src="markup.min.js"></script>`.

Markup.js has a single function: `Mark.up(template, context)`. Here's a basic
example that shows how `template`, a string, is injected with properties of
`context`, an object:

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

You can format any kind of objects, including functions with exposed
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

var template = "{{name}} lives at {{addr.street}} in {{addr.city}}.";

var result = Mark.up(template, context);
// "John Doe lives at 1 Maple Street in Pleasantville."
```

Or you can use nested tags:

``` javascript
var template = "{{name}} lives at {{addr}}{{street}} in {{city}}.{{/addr}}";

var result = Mark.up(template, context);
// "John Doe lives at 1 Maple Street in Pleasantville."
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

You can mix array index notation and object property notation in the same
expression:

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

If a tag resolves to an array, the array is iterated. A single dot refers to
the current iteration context:

``` javascript
var context = {
    name: "John Doe",
    brothers: ["Jack", "Joe", "Jim"]
};

var template = "<ul>{{brothers}}<li>{{.}}</li>{{/brothers}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>Jack</li><li>Joe</li><li>Jim</li></ul>"
```

``` javascript
var context = {
    user: {
        contacts: ["John", "Jane"]
    }
};

var template = "<ul>{{user.contacts}}<li>{{.}}</li>{{/user.contacts}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>John</li><li>Jane</li></ul>"
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
(0...n-1) and a double hash sign refers to the current iteration count
(1...n):

``` javascript
var template = "{{sisters}} {{#}}-{{name.first}} {{/sisters}}";
// " 0-Jill  1-Jen "
```

``` javascript
var template = "{{sisters}} {{##}}-{{name.first}} {{/sisters}}";
// " 1-Jill  2-Jen "
```

This is useful for applying conditional formatting, as described below, and
for creating numbered lists.

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

A pipe can accept arguments. For example, the `blank` pipe accepts a value to
display if the piped input is null or empty:

``` javascript
var template = "Phone: {{phone|blank>N/A}}";

var result = Mark.up(template, context);
// "Phone: N/A"
```

The `choose` pipe accepts two strings and returns one of them depending on
whether the piped input is true or false:

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

Variables can be passed through multiple pipes. Here are two simple examples:

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

Markup.js comes with more than 40 built-in pipes:

`empty` (obj): Test for an empty array, empty string, null, undefined, or 0. `{{if apples|empty}}`

`notempty` (obj): Test for the presence of a value. `{{if apples|notempty}}` or simply `{{if apples}}`

`more` (obj, n): Test if a number, [iterator][1], or array is greater than n. `{{if articles|more>100}}` `{{if #|more>10}}`

`less` (obj, n): Test if a number, [iterator][1], or array is less than n. `{{if age|less>21}}`

`ormore` (obj, n): Test if a number, [iterator][1], or array is greater than or equal to n. `{{if age|ormore>18}}`

`orless` (obj, n): Test if a number, [iterator][1], or array is less than or equal to n. `{{if age|orless>55}}`

`between` (obj, n1, n2): Test if a number, [iterator][1] or array is between n1 and n2, inclusive. `{{if age|between>18>35}}`

`equals` (obj, str): Test for equality (==). `{{if name|equals>Adam}}` `{{if age|equals>35}}`

`notequals` (obj, str): Test for inequality (!=). `{{if name|notequals>Adam}}`

`like` (str, str): Test for a pattern match (case-insensitive). `{{if name|like>Adam}}` `{{if name|like>a.*}}`

`notlike` (str, str): Test for a non-match (case-insensitive). `{{if name|notlike>Adam}}`

`blank` (str, str): Display a default value for a null or empty string. `{{title|blank>Untitled}}`

`upcase` (str): Upper-case a string. `{{name|upcase}}`

`downcase` (str): Lower-case a string. `{{name|downcase}}`

`capcase` (str): Capitalize the first letter in each word. `{{title|capcase}}`

`chop` (str, n): Chop a string to n chars followed by "..." if n < string length. `{{description|chop>100}}`

`tease` (str, n): Chop a string to n words followed by "..." if n < word count. `{{summary|tease>15}}`

`trim` (str): Trim leading and trailing white space from a string. `{{article|trim}}`

`pack` (str): Trim and normalize white space in a string. `{{article|pack}}`

`round` (num): Round a number. `{{age|round}}`

`clean` (str): Strip HTML/XML tags from a string. `{{article|clean}}`

`length` (obj): Get the length of an array, string, or [iterator][1]. `{{apples|length}}` `{{#|length}}`

`size` (obj): Alias of length. `{{apples|size}}` `{{#|size}}`

`reverse` (arr): Reverse an array.\* `{{articles|reverse}} ... {{/articles}}`

`join` (arr [, str]): Join an array with "," or with the given token. `{{names|join> + }}`

`limit` (arr, n1 [, n2]): Limit an array to n1 items beginning at index n2 (or 0). `{{contacts|limit>10}} ... {{/contacts}}`

`split` (str [, str]): Split a string on "," or by the given token. `{{names|split>;}} {{.}} {{/names}}`

`choose` (bool, str [, str]): Output one value if truthy, another if falsy. `{{user.passed|choose>Pass>Fail}}`

`toggle` (obj, str, str [,str]): Switch one string value for another. `{{gender|toggle>M,F>Boy,Girl>N/A}}`

`sort` (arr [, str]): Sort an array, optionally by object property name.\* `{{users|sort>firstname}} ... {{/users}}`

`fix` (num, n): Format a number to n decimal places. `{{weight|fix>1}}`

`mod` (num, n): Get the remainder of a number or [iterator][1] divided by n. `{{rows|mod>10}}`

`divisible` (num, n): Test if a number or [iterator][1] is perfectly divisible by n. `{{if #|divisible>3}}`

`even` (num): Test if a number or [iterator][1] is even. `{{if #|even}}`

`odd` (num): Test if a number or [iterator][1] is odd. `{{if #|odd}}`

`number` (str): Extract a number from a string (e.g. "$1,234.56" or "30px"). `{{price|number}}`

`url` (str): URL-encode a string. `{{article.link|url}}`

`bool` (obj): Cast an object to a boolean value. `{{user.geo_pref_flag|bool}}`

`falsy` (obj): Test for falseness. `{{if expired|falsy}}`

`first` (iterator): Test if an [iterator][1] is first. `{{if #|first}}`

`last` (iterator): Test if an [iterator][1] is last. `{{if #|last}}`

`call` (obj, func [, arg1, arg2, ...]): Call an object function. ([See doc below](#the-call-pipe)) `{{doggy|call>bark>5}}`

`set` (obj, str): Set a variable for later use, outputting nothing. ([See doc below](#the-set-pipe)) `{{user.birthday|set>bday}}`

`log` (obj): Log any variable to the console. ([See doc below](#logging)) `{{article.title|log}}`

\* Source array is not modified.

### The 'call' pipe

The `call` pipe lets you call a function on any object and pass it zero or
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

You can add your own pipes to Markup.js. A pipe is simply a function with one
or more arguments. The first argument (required) is the piped value itself.
Any additional arguments are strings. For example:

``` javascript
Mark.pipes.shout = function (str, n) {
    return str + new Array(parseInt(n || 1) + 1).join("!");
};

var template = "{{exclamation|shout>5}}";

var result = Mark.up(template, { exclamation: "Bonsai" });
// "Bonsai!!!!!"
```

If you prefer, you can pass pipes into the optional `options` argument of
`Mark.up`:

``` javascript
var options = {
    pipes: {
        mypipe: function (str) { ... }
    }
};

var result = Mark.up(template, context, options);
```

Note! All _optional_ pipe arguments are passed as strings. For example, in 
the expression `{{num|add>23>45}}`, "23" and "45" are strings. Therefore, 
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

### Changing the argument delimiter

You can change the argument delimiter from ">" to a character (or characters)
of your choosing:

``` javascript
Mark.delimiter = ":";
```

The delimiter can also be set in the optional `options` argument of `Mark.up`:

``` javascript
var options = {
    delimiter: ":"
};

var result = Mark.up(template, context, options);
```

### More pipes!

Additional pipes are available in `src/extras` for your piping pleasure. 
(These are not included in markup.js.)

## IF and IF/ELSE statements

IF statements are formatted as `{{if expression}} ... {{/if}}`, where
*expression* is a boolean test with optional pipes:

``` javascript
var template = "{{if brothers}} John has {{brothers|size}} brothers! {{/if}}"
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
expressions:

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
var template = "{{if ...}} ... {{else}} {{if ...}} ... {{else}} ... {{/if}} {{/if}}";
```

### Testing loop counters

You can use loop counters (# and ##) to apply conditional formatting:

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

Certain pipes can be used to evaluate the position of the current iteration
context or the size of the array itself. In these cases, # and ## are
interchangeable:

``` javascript
// do something on the first iteration
var template = "{{users}} {{if #|first}} ... {{/if}} ... {{/users}}";
```

``` javascript
// do something on the last iteration
var template = "{{users}} {{if #|last}} ... {{/if}} ... {{/users}}";
```

``` javascript
// test the size of the array during the loop
var template = "{{users}} {{if #|size|more>100}} ... {{/if}} ... {{/users}}";
```

### Pipes in conditional expressions

Boolean pipes, such as `between` or `more`, return the *inputted value* if the
expression is true. Otherwise they return *false*. This way, pipes can be
chained together to form complex AND statements. For example:

``` javascript
// a custom pipe
Mark.pipes.big = function (num) {
    return num > 1000000 ? num : false;
};

var context = { salary: 5000000 };

var template = "{{if salary|big|even}} A nice round number! {{/if}}";
```

In the above example, `salary|big|even` returns *5000000*, which resolves to
*true*. *You should follow this convention if you write boolean pipes.*

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

### Functions as includes

You can even include a *function* that returns a string when the template is
processed:

``` javascript
Mark.includes.status = function () {
    return "You are here: " + location.href;
};

var template = "Welcome! {{status}}";

var result = Mark.up(template, context);
// "Welcome! You are here: http://www.example.com/"
```

*Includes are accessible in the global scope of template execution and from
one template to another. They take precedence over `context` variables with
the same name, so be careful to avoid naming conflicts.*

## Global variables

You can create global variables for use anywhere inside a template. For
example:

``` javascript
Mark.globals.img_width = 200;

var template = "{{images}} <img width='{{img_width}}'/> {{/images}}";
```

A global variable can be any kind of object. As with includes, global
variables can be passed into the optional `options` argument of `Mark.up`:

``` javascript
var options = {
    globals: {
        img_width: 200,
        img_height: 300
    }
};

var result = Mark.up(template, context, options);
```

### The 'set' pipe

The special `set` pipe lets you set a global variable *inside the template itself*:

``` text
{{users|size|set>num_users}}

{{if num_users|more>10}}
    ...
{{/if}}
```

*Global variables are accessible from one template to another. They take
precedence over includes and `context` variables with the same name, so be 
careful to avoid naming conflicts.*

## Backtick expressions

Although it's rarely necessary, you might want to pass a context variable as
an argument to a pipe. You can do this by enclosing the variable in backticks:

``` javascript
var context = {
    "name": "John",
    "age": 50,
    "retirement_age": 55
};

var template = "{{if age|more>`retirement_age`}} Life of leisure {{/if}}";
```

The statement within backticks can be a fully qualified expression, as in:

``` text
{{if age|more>`spouse.age|times>2`}} Ewwwwww {{/if}}
```

This technique also applies to global variables:

``` text
{{user.prefs.colors.0|set>favorite_color}}

{{if other_color|equals>`favorite_color`}} Match! {{/if}}
```

As a best practice, business logic should stay in the business layer of your
application. Compare the readability of the following expressions:

``` text
{{if user.age|more>`user.retirement_age`}}

{{if user.retired}}
```

## White space

Sometimes it's convenient to remove all white space between HTML or XML nodes
in the final output. For example, you might want `<div>A</div> <div>B</div>`
to become `<div>A</div><div>B</div>`. To remove white space:

``` javascript
Mark.compact = true;
```

Or, via the `options` argument:

``` javascript
var options = {
    compact: true
};

var result = Mark.up(template, context, options);
```

## Logging

You can log any variable to the console for debugging purposes with the `log` 
pipe:

``` text
<!-- logs "LION" "TIGER" "BEAR" -->
{{animals}}
    {{name|upcase|log}}
{{/animals}}

<!-- logs "lion" "tiger" "bear" -->
{{animals}}
    {{name|log|upcase}}
{{/animals}}
```

## Gotchas

Here are some common traps to avoid:

### Ambiguous templates

The following template is ambiguous because the first tag is unclosed:

``` javascript
var template = "Adam has {{bros|length}} brothers: {{bros}}...{{/bros}}";
```

In such cases, you should use a self-closing tag:

``` javascript
var template = "Adam has {{bros|length /}} brothers: {{bros}}...{{/bros}}";
```

### Incorrect notation

Markup.js uses dot notation, not bracket notation, for both objects and
arrays:

``` javascript
var context = {
    name: { first: "John", last: "Doe" },
    colors: ["Red", "Blue", "Green"]
};

// WRONG
var template = "First name: {{name[first]}}";

// RIGHT
var template = "First name: {{name.first}}";

// WRONG
var template = "Favorite color: {{colors[0]}}";

// RIGHT
var template = "Favorite color: {{colors.0}}";
```

### Use of quote marks in pipes

Markup.js treats all piped variables as strings, so quote marks are treated 
like any other characters:

``` javascript
// WRONG
var template = "{{if name|like>'Adam'}} ...";

// RIGHT
var template = "{{if name|like>Adam}} ...";
```

## Browser implementation

You can implement Markup.js in a few different ways. The right strategy
depends on many factors, including the speed and size of your app, the number
of templates you're handling, and whether you want the templates to be
reusable throughout your codebase.

### 1. Writing templates as JavaScript strings

You can write templates as JavaScript string literals, as shown above.
It's a good idea to put all your templates together in one file:

``` javascript
// templates.js
myapp.templates = {
    user_details: "<div> ... </div>",
    user_sidebar: "<div> ... </div>"
};
```

As your app grows, you might consider splitting up your templates by
functional area and loading only some of them at a time:

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

You can use jQuery to inject an evaluated template into a document element:

``` javascript
var template = myapp.templates.user_sidebar;

var context = user.data;

$("#sidebar").html(Mark.up(template, context));
```

Or, without jQuery:

``` javascript
document.getElementById("sidebar").innerHTML = Mark.up(template, context);
```

### 2. Embedding templates in &lt;script&gt; tags

The above method can be unwieldy if you're dealing with large chunks of HTML.
Instead, you might want to embed templates inside `<script>` tags:

``` text
<!-- people.html -->
...
<script id="persons-list" type="text/template">
    <h1>People</h1>
    <ul>
        {{persons|sort>lastName}}
            <li>{{lastName}}, {{firstName}}</li>
        {{/persons}}
    </ul>
</script>
...
```

Then extract the template from the `<script>` tag:

``` javascript
var template = document.getElementById("persons-list").firstChild.textContent;
```

Be sure to specify `type="text/template"` on the script tag or else browsers
will interpret the contents as JavaScript.

### 3. Loading templates with AJAX

The above method makes it easier to write templates but harder to reuse them
throughout your app. A compromise solution is to write your templates in plain
text files and load them via AJAX. Here's how to do it with jQuery:

``` javascript
$.get("user-template.txt", function (txt) {
    // do stuff
}, "html");
```

To reduce the number of network requests, you can put multiple templates in a
single text file:

``` text
===== user_detail
<div class="user-details">
    ...
</div>

===== user_profile
<div class="user-profile">
    ...
</div>
```

Then load and parse the file:

``` javascript
var templates = {};

$.get("user-templates.txt", function (text) {
    var chunks = text.split("=====").splice(1);
    var i, key;
 
    chunks.forEach(function (chunk) {
        i = chunk.indexOf("\n");
        key = chunk.substr(0, i).trim();
        templates[key] = chunk.substr(i).trim();
    });

}, "html");
```

You can also cache templates in [Local Storage](http://diveintohtml5.info/storage.html) 
or the [Application Cache](http://www.html5rocks.com/en/tutorials/appcache/beginner/) 
for instantaneous retrieval.

## Server implementation

You can install Markup.js as a [Node.js package](https://npmjs.org/package/markup-js):

```
$ npm install markup-js
```

Then require `markup-js` and load your templates from the file system:

``` javascript
var Mark = require("markup-js"),
    fs = require("fs");

// load asynchronously
fs.readFile("some-template.txt", "utf8", function (err, data) {
    var template = data;
    ...
});

// or load synchronously
var template = fs.readFileSync("some-template.txt", "utf8");
```

## Internationalization (i18n)

Markup.js can support internationalization of your UI. Here's a basic approach
to creating a resource "bundle" for each target language:

``` javascript
// english
var resources = {
    hello_msg: "Hi, {{user.name}}.",
    goodbye_msg: "Bye, {{user.name}}."
};
```

``` javascript
// spanish
var resources = {
    hello_msg: "Hola, {{user.name}}.",
    goodbye_msg: "Adios, {{user.name}}."
};
```

You can load the appropriate bundle with a 
[conditional script loader](http://microjs.com/#loader) or other mechanism.

Alternatively, you can declare resources as properties in a plain text file:

``` text
# en.txt
hello_msg=Hi, {{user.name}}.
goodbye_msg=Bye, {{user.name}}.
```

Then load and parse the file:

``` javascript
var resources = {};

$.get("en.txt", function (text) {
    var lines = text.split("\n");
    var i, key;

    lines.forEach(function (line) {
        if (line.length && line.charAt(0) !== "#") {
            i = line.indexOf("=");
            key = line.substr(0, i).trim();
            resources[key] = line.substr(i + 1).trim();
        }
    });

}, "html");
```

If you use Markup.js for markup and translation at the same time, you can
assign your resource strings to the `includes` variable, then refer to these
strings from within your HTML templates:

``` javascript
Mark.includes = {
    hello_msg: "Hi, {{user.name}}.",
    goodbye_msg: "Bye, {{user.name}}."
};

var template = "<div class='hi-bye'>{{hello_msg}} {{goodbye_msg}}</div>";

var context = {
    user: { name: "Adam" }
};

var result = Mark.up(template, context);
// "<div class='hi-bye'>Hi, Adam. Bye, Adam.</div>"
```

### Pluralization

The `pluralize` pipe, provided in `src/extras/i18n.js`, handles pluralized
forms in any language you require. To prepare your app for pluralization:

First, add [pluralization functions](http://translate.sourceforge.net/wiki/l10n/pluralforms) 
to the `pluralize` pipe for the languages you intend to support (English is
included by default). A pluralization function accepts an array of strings and
a number, then returns one of the strings:

``` javascript
...
var plurals = {
    // English has two plural forms
    "en": function (msgs, n) {
        return msgs[n === 1 ? 0 : 1];
    },
    // Czech has three plural forms
    "cs": function (msgs, n) {
        return msgs[n === 1 ? 0 : (n >= 2 && n <= 4) ? 1 : 2];
    }
};
...
```

Next, set the user's language, or detect it from the web browser:

``` javascript
...
var lang = navigator.language.split("-")[0];

if (!lang in plurals) {
    lang = "en";
}
...
```

Next, create resource strings for the target language. For expressions that
require pluralization, use ";;" to delimit each plural form:

``` javascript
// English messages
Mark.includes = {
    welcome_msg: "Welcome, {{name}}. {{credit_msg|pluralize>`credits`}}",
    credit_msg: "You have one credit.;;You have {{credits}} credits.",
    error_msg: "Oops! There was an error."
};
```

Notice how one include can include another, as `welcome_msg` includes
`credit_msg`. Also notice how `pluralize` accepts a dynamic variable (in
backticks) to determine which part of `credit_msg` to extract.

Finally, put it all together:

``` javascript
var context = {
    name: "Adam",
    credits: 50
};

var template = "<p class='welcome'>{{welcome_msg}}</p>";

var result = Mark.up(template, context);
// "<p class='welcome'>Welcome, Adam. You have 50 credits.</p>"
```

### Dates, numbers and currencies

Web browsers provide no convenient way to format dates, although there are 
some good libraries that you can drop into a custom pipe, like
[Moment.js](http://momentjs.com/):

``` javascript
Mark.pipes.moment = function (date, format) {
    return moment(new Date(date)).format(format);
};
```

Or you can simply use the browser's built-in locale methods:

``` javascript
Mark.pipes.date = function (date) {
    return new Date(+date || date).toLocaleDateString();
};

Mark.pipes.time = function (date) {
    return new Date(+date || date).toLocaleTimeString();
};

Mark.pipes.datetime = function (date) {
    return new Date(+date || date).toLocaleString();
};
```

For numbers and currencies, try 
[Accounting.js](http://josscrowcroft.github.com/accounting.js/):

``` javascript
Mark.pipes.dollars = function (num) {
    return accounting.formatMoney(+num);
};

Mark.pipes.euros = function (num) {
    return accounting.formatMoney(+num, "€", 2, ".", ",");
};
```

See `src/extras/dates.js` and `src/extras/numbers.js` for additional examples.

## Compatibility

Markup.js is compatible with Chrome, Safari, Firefox, Internet Explorer 9,
Node.js, and various mobile WebKit browsers. Please [submit an issue][2] to 
report incompatibilities or other bugs. 

### Ports

Markup.js is also available for [PHP][3].

## License

Copyright (C) 2011 - 2013 by Adam Mark

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

[1]: #loop-counters
[2]: https://github.com/adammark/Markup.js/issues
[3]: https://github.com/mattparlane/Markup.php