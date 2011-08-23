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

TODO

## Loops

TODO

## Conditional statements

TODO

*Nested if statements are not currently supported.*

*If/else statements are not currently supported.*

## Pipes

TODO

### Chaining pipes

TODO

### Built-in pipes

TODO

### Writing custom pipes

TODO

## Includes

TODO

TODO

## Compatibility

TODO

## License

TODO

Copyright 2011 Adam Mark
