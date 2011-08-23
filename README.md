# Markup.js — Powerful JavaScript templates

Markup.js is a simple yet surprisingly powerful template system for JavaScript.

## Why Markup.js

TODO 

## Usage

Include `<script src="markup.min.js"></script>`. With gzip, it's only *1.2KB!*

Markup.js has a single function: `Mark.up(template, context)`. Here's a basic
example that shows how the `template` string is injected with properties of the 
`context` object:

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

Alternatively, `context` can be a Function object:

``` javascript
function Person(name) {
    this.name = name;
};

var template = "Hi, {{name}}!";

var context = new Person("Adam");

var result = Mark.up(template, context); // "Hi, Adam!"
```

## Nested objects

Object hierarchies can be expressed with simple dot notation. For example:

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

The same structure can be expressed with nested tags:

``` javascript
var template = "{{name}} lives on {{addr}}{{street}} in {{city}}.{{/addr}}";

var result = Mark.up(template, context);
// "John Doe lives on 1 Maple Street in Pleasantville."
```

Or you can use a combination of these techniques:

``` javascript
var template = "ZIP: {{addr}}{{zip.main}}-{{zip.ext}}{{/addr}}";

var result = Mark.up(template, context);
// "ZIP: 12345-6789"
```

TODO note on self-closed tags

## Loops

Arrays are expressed in the same fashion. The special notation `{{.}}` 
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

In arrays of objects, object values are expressed by property name:

``` javascript
var context = {
    name: "John Doe",
    sisters: [{name: "Jill"}, {name: "Jen"}]
};

var template = "<ul>{{sisters}}<li>{{name}}</li>{{/sisters}}</ul>";

var result = Mark.up(template, context);
// "<ul><li>Jill</li><li>Jen</li></ul>"
```

Dot notation can be used here as well:

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

## Pipes

Pipes are a powerful way to transform variables. Here's a simple example:

``` javascript
var context = {
    name: "John Doe",
    alias: " J-Do ",
    phone: null,
    gender: "male",
    age: 33.33,
    brothers: ["Jack", "Joe", "Jim"],
    jiggy: true
};

var template = "Name: {{name|upcase}}";

var result = Mark.up(template, context);
// "Name: JOHN DOE"
```

A pipe can accept arguments. For example, the `blank` pipe accepts a
value to display if the piped variable is null, false or undefined:

``` javascript
var template = "Phone: {{phone|blank>N/A}}";

var result = Mark.up(template, context);
// "Phone: N/A"
```

The `choose` pipe accepts two arguments and returns one of them
depending on whether the piped value is true or false:

``` javascript
var template = "John is jiggy: {{jiggy|choose>Yes>No}}";

var result = Mark.up(template, context);
// "John is jiggy: Yes"
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

Markup.js comes with more than 30 built-in pipes. Below, the first
argument is always the piped value itself:

`empty` (obj): returns obj if empty, else returns false

`notempty` (obj): returns obj if notempty, else returns false

`more` (a, b): returns a if a > b, else returns false

`less` (a, b): returns a if a < b, else returns false

`ormore` (a, b): returns a if a >= b, else returns false

`orless` (a, b): returns a if a <= b, else returns false

`equals` (a, b): returns a if a == b, else returns false

`notequals` (a, b): returns a if a != b, else returns false

`blank` (str, val): returns val if str is false/null/undefined, else returns str

`like` (str, pattern): returns true if regex pattern matches str, else returns false

`notlike` (str, pattern): opposite of `like`

`upcase` (str): returns str upper-cased

`downcase` (str): returns str down-cased

`chop` (str, n): chops str to n chars followed by "..." if n > str.length

`trim` (str): returns str with leading and trailing white space removed

`pack` (str): returns str with white space packed. ex: `" a  b " > "a b"`

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

`choose` (bool, iffy, elsy): returns iffy if bool is true, otherwise returns elsy

`sort` (arr, prop): returns arr sorted. optionally sort by property prop 

`fix` (num, n): returns num to n decimal places

`url` (str): returns str URL-encoded

`call` (obj, fn, arg1, arg2...): power pipe! calls fn on obj with zero or more args

*Note: Arrays are copied before sorting or slicing.*

### Power pipe

With great power comes great responsibility.  Thus the `call` pipe,
which allows you to call a function on any object and pass it zero or
more scalar values:

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

    this.bark = function (count) {
        var response = [];
        for (var i = 0; i < count; i++) {
            response.push(greeting);
        }
        return response.join(" ");
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

You can add your own pipes to Markup.js. The first argument should always
be the piped value. For example:

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

Alternatively, you can pass pipes into the optional `options` 
argument of `Mark.up`:

``` javascript
var options = {
    pipes: {"repeat": repeat}
};

var result = Mark.up(template, context, options);
```

More pipes are available in `src/pipes`. (These are not included
in markup.js.)

## Conditional statements

"If" statements follow the same basic rules as above:

``` javascript
var template = "{{if age|more>75}} John is a ripe old {{age|round}}! {{/if}}"
```

If the `{{if}}` statement is true, the child contents will be evaluated.
(The context does not change inside the {{if}} statement. In the above
example, we still have access to `{{age}}` and sibling properties.)

Pipes can be chained in if statements as well:

``` javascript
var template = "{{if age|more>50|less>75}} John is middle aged. {{/if}}"
```

When piping array values, the last pipe should always return its 
piped input (if true) or false (if false).

*Note: Nested if statements are not currently supported.*

*Note: If/else statements are not currently supported.*

## Includes

You can include templates inside other templates. For example:

``` javascript
Mark.includes.greeting = "My name is {{name|upcase}}!";

var template = "Hello! {{greeting}}";

var result = Mark.up(template, context);
// "Hello! My name is JOHN DOE!"
```

You can even pipe the output of the included template itself:

``` javascript
var template = "Hello! {{greeting|upcase}}";

var result = Mark.up(template, context);
// "Hello! MY NAME IS JOHN DOE!"
```

As with custom pipes, includes can be passed into the optional `options`
argument of `Mark.up`:

``` javascript
var options = {
    pipes: {"repeat": repeat},
    includes: {
        "header": header,
        "footer": footer
    }
};

var result = Mark.up(template, context, options);
```

*Be careful to avoid naming conflicts with other variables names.*

## Implementation

HTML templates tend to be longer than the examples shown here. In your app,
you might consider putting all your templates into a single JS file:

``` javascript
// templates.js
myapp.templates = {
    "user_profile": "...",
    "user_sidebar": "...",
};
```

You can use jQuery to inject an evaluated template into an element
in your document:

``` javascript
var template = myapp.templates.user_profile;
var context = user.profileInfo;

$("#sidebar").html(Mark.up(template, context));
```

Or, without jQuery:

``` javascript
document.getElementById("sidebar").innerHTML = Mark.up(template, context);
```

If strings aren't your style, you can embed templates inside HTML 
`<script>` tags ...

``` javascript
<script type="text/markupjs" id="sidebar_tpl">
    <div>
        Name: {{name.last}}, {{name.first}}
    </div>
    <div>
        Addr: {{addr}}{{street}}<br>{{city}},{{state}} {{zip}}{{/addr}}
    </div>
</script>
```

... and then reference them by ID:

``` javascript
var template = document.getElementById("sidebar_tpl").innerText;
```

## Compatibility

TODO Chrome 13+, Safari 5+, etc.

## Next Steps

- Nested IF expressions
- ELSE expressions

## License

TODO

Copyright 2011 Adam Mark
