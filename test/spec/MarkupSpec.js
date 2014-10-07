describe("Markup core spec", function () {
    var template;
    var result;
    var context = {
        name: {first: "John", middle: "", last: "Doe"},
        age: 33.3,
        weight: 145,
        gender: "male",
        alias: " J. Doe ",
        phone: "",
        fax: " ",
        address: "1 Maple Street",
        zip: "12345",
        race: null,
        brothers: ["Jack", "Joe", "Jim"],
        sisters: [{name: "Jill"}, {name: "Jen"}],
        cousin: { name: { first: "Jake" } },
        alpha: { beta: ["a","b","c","d","e"] },
        children: [],
        path: "example.com?a=b c=d",
        link: "<a href=\"http://www.example.com\">example.com</a>",
        greet: " Top  of  the  morning ",
        parents: undefined,
        truthy: true,
        falsy: false,
        birthday: "Thu Feb 23 2012 10:21:41 GMT-0500 (EST)",
        friend: { name: "Justin", friend: { name: "Jeremy" } },
        foods: { fruits: [ {"name":"apple"}, {"name":"orange"} ] },
        motto: "life is like a box of chocolates",
        obj: { truthy: true, falsy: false },
        _chars: [ ["a","b","c"], ["d","e","f"] ],
        $price: "$123,456.78",
        $products: ["apple", "orange"]
    };

    beforeEach(function () {
        Mark.delimiter = ">";
        Mark.compact = false;
        template = "";
        result = "";
    });

    it("resolves scalar value", function () {
        template = "gender: {{gender}}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: male");

        template = "gender: {{ gender }}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: male");

        template = "gender: {{ gender | upcase }}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: MALE");

        template = "gender: {{ gender | upcase | downcase }}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: male");

        template = "price: {{$price}}";
        result = Mark.up(template, context);
        expect(result).toEqual("price: $123,456.78");
    });

    it("preserves white space", function () {
        template = "{{alias}}";
        result = Mark.up(template, context);
        expect(result).toEqual(" J. Doe ");

        template = "{{alias|trim}}";
        result = Mark.up(template, context);
        expect(result).toEqual("J. Doe");

        template = "\n{{alias}}\n";
        result = Mark.up(template, context);
        expect(result).toEqual("\n J. Doe \n");
    });

    it("compacts white space between xml elements", function () {
        Mark.compact = true;

        template = "<adam> </adam> <mark> </mark>";
        result = Mark.up(template, {});
        expect(result).toEqual("<adam></adam><mark></mark>");

        template = "<adam>\n   \n   \n</mark>";
        result = Mark.up(template, {});
        expect(result).toEqual("<adam></mark>");

        template = "<adam>\n   \n   \n</mark>";
        result = Mark.up(template, {}, { "compact": false });
        expect(result).toEqual("<adam>\n   \n   \n</mark>");
    });

    it("resolves object dot notation", function () {
        template = "{{name.last}}, {{   name.first   }}";
        result = Mark.up(template, context);
        expect(result).toEqual("Doe, John");

        template = "{{name.last|downcase}}, {{name.first|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("doe, JOHN");
    });

    it("resolves nested object notation", function () {
        template = "{{name}}Last name: {{last}}{{/name}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Last name: Doe");
    });

    it("resolves combo object notation", function () {
        template = "{{cousin}}{{name.first}}{{/cousin}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jake");

        template = "{{cousin.name}}{{first}}{{/cousin.name}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jake");
    });

    it("resolves array index notation", function () {
        template = "First brother: {{brothers.0}}";
        result = Mark.up(template, context);
        expect(result).toEqual("First brother: Jack");

        template = "First sister: {{sisters.0.name}}";
        result = Mark.up(template, context);
        expect(result).toEqual("First sister: Jill");

        template = "First sister: {{sisters.0.name|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("First sister: JILL");

        template = "{{$products}}*{{.}}*{{/$products}}";
        result = Mark.up(template, context);
        expect(result).toEqual("*apple**orange*");
    });

    it("resolves template with no context object", function () {
        template = "La la la";
        result = Mark.up(template);
        expect(result).toEqual("La la la");

        template = "La {{la}} la";
        result = Mark.up(template);
        expect(result).toEqual("La ??? la");
    });

    it("resolves nested objects with same name", function () {
        template = "friend's friend: {{friend}}{{friend}}{{name}}{{/friend}}{{/friend}}";
        result = Mark.up(template, context);
        expect(result).toEqual("friend's friend: Jeremy");

        template = "friend's friend: {{friend}}{{friend.name}}{{/friend}}";
        result = Mark.up(template, context);
        expect(result).toEqual("friend's friend: Jeremy");

        template = "friend's friend: {{friend}}{{friend.name/}}{{/friend}}";
        result = Mark.up(template, context);
        expect(result).toEqual("friend's friend: Jeremy");

        template = "brothers: {{brothers|join> + /}} {{brothers}}x{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: Jack + Joe + Jim xxx");
    });

    it("resolves nested if statements", function () {
        template = "{{if truthy}}x{{if falsy}}y{{else}}{{if truthy}}Y{{/if}}{{/if}}z{{/if}}@";
        result = Mark.up(template, context);
        expect(result).toEqual("xYz@");

        template = "{{if truthy}}x{{if falsy}}y{{else}}{{if falsy}}Y{{else}}3{{/if}}{{/if}}z{{/if}}%";
        result = Mark.up(template, context);
        expect(result).toEqual("x3z%");

        template = "{{if truthy}}x{{if truthy}}y{{else}}Y{{/if}}z{{/if}}#";
        result = Mark.up(template, context);
        expect(result).toEqual("xyz#");

        template = "{{if truthy}}x{{if falsy}}y{{else}}Y{{/if}}z{{/if}}!";
        result = Mark.up(template, context);
        expect(result).toEqual("xYz!");

        template = "{{if truthy}}{{if truthy}}abc{{/if}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("abc");

        template = "{{if truthy}}{{if falsy}}abc{{/if}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if falsy}}{{if truthy}}abc{{/if}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if truthy}}x{{if truthy}}y{{/if}}z{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("xyz");

        template = "{{if truthy}}x{{if truthy}}y{{else}}Y{{/if}}z{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("xyz");

        template = "{{if truthy}}x{{if falsy}}y{{else}}Y{{/if}}z{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("xYz");

        template = "{{if truthy}}a{{if falsy}}b{{/if}}c{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("ac");

        template = "{{if age|more>10}}x{{if age|less>10}}y{{/if}}z{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("xz");

        template = "{{if falsy}}x{{if truthy}}y{{/if}}z{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if truthy}}{{if truthy}}{{if truthy}}x{{/if}}{{weight}}{{/if}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("x145");

        template = "{{if truthy}}1{{/if}}2{{if falsy}}3{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("12");

        template = "{{weight}}{{weight}}{{if truthy}}{{if truthy}}abc{{/if}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("145145abc");
    });

    it("resolves undefined/empty values", function () {
        template = "{{if parents}}+++{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if phone}}+++{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if foo}}!!!{{else}}%%%{{/if}}";
        result = Mark.up(template, {});
        expect(result).toEqual("%%%");

        template = "{{if foo}}@@@{{else}}###{{/if}}";
        result = Mark.up(template, {foo: undefined});
        expect(result).toEqual("###");

        template = "{{if foo}}@@@{{else}}foo: {{foo}}{{/if}}";
        result = Mark.up(template, {foo: undefined});
        expect(result).toEqual("foo: ???");

        template = "{{if foo|empty}}foo: {{foo}}{{else}}@@@{{foo}}{{/if}}";
        result = Mark.up(template, {foo: undefined});
        expect(result).toEqual("foo: ???");

        template = "{{if foo}}{{foo|upcase}}{{else}}^^^{{/if}}";
        result = Mark.up(template, {});
        expect(result).toEqual("^^^");

        template = "La la {{la}}";
        result = Mark.up(template);
        expect(result).toEqual("La la ???");

        template = "{{cousin}}{{name.last}}{{/cousin}}";
        result = Mark.up(template, context);
        expect(result).toEqual("???");

        template = "whatever: {{whatever|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("whatever: ???");

        template = "whatever: {{whatever}}xxx{{/whatever}}";
        result = Mark.up(template, context);
        expect(result).toEqual("whatever: ???");

        template = "whatever: {{whatever|reverse}}xxx{{/whatever}}";
        result = Mark.up(template, context);
        expect(result).toEqual("whatever: ???");

        template = "123{{if parents}}..{{parents.0.name}}..{{/if}}789";
        result = Mark.up(template, context);
        expect(result).toEqual("123789");

        template = "... {{cousin.name.middle}} {{cousin.name.middle.xxx}} ...";
        result = Mark.up(template, context);
        expect(result).toEqual("... ??? ??? ...");

        template = "{{sisters}}{{color}}{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("??????");
    });

    it("resolves single pipe on scalar value", function () {
        template = "gender: {{gender|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: MALE");

        template = "age: {{age|round}}";
        result = Mark.up(template, context);
        expect(result).toEqual("age: 33");
    });

    it("resolves null scalar value", function () {
        template = "race: {{race|blank>N/A}}";
        result = Mark.up(template, context);
        expect(result).toEqual("race: N/A");
    });

    it("resolves boolean values", function () {
        template = "{{truthy}} {{falsy}}";
        result = Mark.up(template, context);
        expect(result).toEqual("true false");

        template = "{{obj.truthy}} {{obj.falsy}}";
        result = Mark.up(template, context);
        expect(result).toEqual("true false");
    });

    it("resolves multiple pipes on scalar value", function () {
        template = "gender: {{gender|upcase|chop>2}}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: MA...");

        template = "gender: {{gender | upcase | chop > 2 }}";
        result = Mark.up(template, context);
        expect(result).toEqual("gender: MA...");
    });

    it("resolves simple array", function () {
        template = "brothers: {{brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: JackJoeJim");

        template = "brothers: {{brothers|join> * }}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: Jack * Joe * Jim");

        template = "brothers: {{brothers|join> * /}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: Jack * Joe * Jim");

        template = "brothers: {{brothers}} {{brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: JackJoeJim JackJoeJim");
    });

    it("resolves self reference in iteration", function () {
        template = "brothers: {{brothers}}+{{.}}+{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: +Jack++Joe++Jim+");

        template = "brothers: {{brothers}}+{{.|upcase}}+{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: +JACK++JOE++JIM+");
    });

    it("resolves object self reference", function () {
        function Adam() {
            this.getName = function () {
                return "Adam";
            };
            this.age = 36;
        };

        template = "Name: {{adam}}{{.|call>getName}}{{/adam}}";
        result = Mark.up(template, { adam: new Adam() });
        expect(result).toEqual("Name: Adam");

        template = "Num: {{num}}{{.|call>toFixed>1}}{{/num}}";
        result = Mark.up(template, { num: 123 });
        expect(result).toEqual("Num: 123.0");
    });

    it("resolves multiple pipes on simple array", function () {
        template = "brothers: {{brothers|sort|join> @ }}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: Jack @ Jim @ Joe");
    });

    it("resolves complex array", function () {
        template = "sisters: {{sisters}}<li>{{name}}</li>{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("sisters: <li>Jill</li><li>Jen</li>");
    });

    it("resolves iteration using dot notation", function () {
        template = "{{alpha.beta}}{{.}}{{/alpha.beta}}";
        result = Mark.up(template, context);
        expect(result).toEqual("abcde");

        template = "{{alpha.beta|reverse}}{{.}}{{/alpha.beta}}";
        result = Mark.up(template, context);
        expect(result).toEqual("edcba");

        template = "{{alpha.beta|reverse}}{{.|upcase}}{{/alpha.beta}}";
        result = Mark.up(template, context);
        expect(result).toEqual("EDCBA");

        template = "{{foods.fruits}}{{name}}+{{/foods.fruits}}";
        result = Mark.up(template, context);
        expect(result).toEqual("apple+orange+");
    });

    it("resolves pipe on complex array", function () {
        template = "sisters: {{sisters|reverse}}<li>{{name}}</li>{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("sisters: <li>Jen</li><li>Jill</li>");

        template = "sisters: {{sisters|reverse}}<li>{{name|upcase}}</li>{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("sisters: <li>JEN</li><li>JILL</li>");
    });

    it("resolves pipe on object", function () {
        template = "obj: {{obj|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("obj: [OBJECT OBJECT]");
    });

    it("resolves if", function () {
        template = "{{if brothers}}{{brothers|size}} brothers{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("3 brothers");

        template = "{{if brothers}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        // space if tag
        template = "{{if brothers }}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{ if brothers}}&&&{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("&&&");

        // space else tag
        template = "{{if children}}***{{ else }}###{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("###");

        // space /if tag
        template = "{{if children}}***{{else}}@@@{{/if }}";
        result = Mark.up(template, context);
        expect(result).toEqual("@@@");

        template = "{{if brothers|empty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if brothers|more>2}}yes!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("yes!");

        template = "{{if brothers|more>4}}no!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if gender|equals>male}}{{gender}}!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("male!");

        template = "{{if gender|equals>male}}{{age}}!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("33.3!");

        template = "{{if name.first|equals>John}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{name}}{{first}}{{if .|equals>John}}***{{/if}}{{/first}}{{/name}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{if alpha.beta|size|more>1}}@@@{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("@@@");

        template = "{{if alpha.beta}}zzz{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("zzz");
    });

    it("resolves if/else", function () {
        template = "{{if brothers|more>1}}yes!{{else}}no!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("yes!");

        template = "{{if brothers|less>1}}yes!{{else}}no!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("no!");

        template = "{{if brothers|more>1}}{{brothers.0}}{{else}}no!{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack");

        template = "{{if brothers|less>1}}yes!{{else}}{{brothers.1}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Joe");
    });

    it("resolves empty or not empty", function () {
        template = "{{if brothers|empty}}***1{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if brothers|notempty}}***2{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***2");

        template = "{{if parents|empty}}***3{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***3");

        template = "{{if parents|notempty}}***4{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("handles undeclared pipe", function () {
        template = "{{gender|foo}}";
        result = Mark.up(template, context);
        expect(result).toEqual("male");

        template = "{{gender|upcase|foo}}";
        result = Mark.up(template, context);
        expect(result).toEqual("MALE");
    });

    it("handles null pointer", function () {
        template = "{{race|chop>50}}";
        result = Mark.up(template, context);
        expect(result).toEqual("null");
    });

    it("resolves custom pipes", function () {
        // passed arg
        var times = function (num, n) {
            return num * n;
        };

        template = "brothers: {{brothers|size|times>3}}";
        result = Mark.up(template, context, { pipes: { times: times }});
        expect(result).toEqual("brothers: 9");

        // set manually
        Mark.pipes.divide = function (num, n) {
            return num / n;
        };

        template = "brothers: {{brothers|size|divide>3}}";
        result = Mark.up(template, context);
        expect(result).toEqual("brothers: 1");
    });

    it("resolves included strings", function () {
        // passed arg
        var greeting = "My name is {{name.first|upcase}}!";

        template = "Hello! {{greeting}}";
        result = Mark.up(template, context, { includes: { greeting: greeting }});
        expect(result).toEqual("Hello! My name is JOHN!");

        // set manually
        Mark.includes.greeting = "My name is {{name.first|downcase}}!";

        template = "Hello! {{greeting}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Hello! My name is john!");

        // pipe include
        template = "Hello! {{greeting|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Hello! MY NAME IS JOHN!");
    });

    it("resolves included functions", function () {
        Mark.includes.lala = function () {
            return "xyz";
        };

        template = "ABC {{lala}}";
        result = Mark.up(template, context);
        expect(result).toEqual("ABC xyz");

        template = "ABC {{lala|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("ABC XYZ");
    });

    it("resolves iterator in included templates", function () {
        Mark.includes.iterIndex = "{{#}} ";

        template = "{{brothers}}{{iterIndex}}{{/brothers}}";
        result = Mark.up(template, context);
        
        expect(result).toEqual("0 1 2 ");
    });

    it("resolves globals", function () {
        Mark.globals.apple = "APPLE";

        template = "{{brothers}}{{.}}-{{apple}} {{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack-APPLE Joe-APPLE Jim-APPLE ");

        template = "{{brothers}}{{.}}-{{apple}}-{{orange}} {{/brothers}}";
        result = Mark.up(template, context, { globals: { orange: "ORANGE" }});
        expect(result).toEqual("Jack-APPLE-ORANGE Joe-APPLE-ORANGE Jim-APPLE-ORANGE ");

        template = "{{fruits.0}}";
        result = Mark.up(template, context, { globals: { fruits: ["apple", "orange"] }});
        expect(result).toEqual("apple");

        template = "{{alpha.beta}}";
        result = Mark.up(template, context, { globals: { alpha: { beta: "delta" } }});
        expect(result).toEqual("delta");

        template = "{{alpha.beta|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("DELTA");

        template = "{{alpha|set>_alpha}}{{_alpha.beta}}";
        result = Mark.up(template, context);
        expect(result).toEqual("delta");

        template = "{{alpha}}{{.}},{{/alpha}}";
        result = Mark.up(template, context, { globals: { alpha: ["a","b","c"] }});
        expect(result).toEqual("a,b,c,");

        template = "{{bool}}";
        result = Mark.up(template, {}, { globals: { bool: false } });
        expect(result).toEqual("false");
    });

    it("resolves iteration counter", function () {
        template = "{{brothers}}{{#}}-{{.}} {{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("0-Jack 1-Joe 2-Jim ");

        template = "{{brothers}}{{##}}-{{.}} {{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("1-Jack 2-Joe 3-Jim ");

        template = "{{brothers|limit>1}}{{#}}-{{.}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("0-Jack");

        template = "{{brothers}}{{if #|ormore>2}}{{#}}-{{.}}-{{#}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("2-Jim-2");

        template = "{{brothers}}{{if #|more>0|less>2}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Joe");

        template = "{{brothers}}{{if #|even}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("JackJim");

        template = "{{brothers}}{{if ##|even}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Joe");

        template = "{{brothers}}{{if #|odd}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Joe");

        template = "{{brothers}}{{if #|equals>1}}{{.}}${{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Joe$");

        template = "{{brothers}}{{if #|divisible>2}}{{.}}${{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack$Jim$");

        template = "{{sisters}}{{#|fix>2}} {{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("0.00 1.00 ");
    });

    it("resolves custom delimiter", function () {
        Mark.delimiter = ":"
        template = "{{name.middle|blank:N/A}}";
        result = Mark.up(template, context);
        expect(result).toEqual("N/A");

        template = "{{name.middle|blank::N/A}}";
        result = Mark.up(template, context, { delimiter: "::" });
        expect(result).toEqual("N/A");
    });

    it("resolves pipe: blank", function () {
        template = "{{name.first|blank>N/A}}";
        result = Mark.up(template, context);
        expect(result).toEqual("John");

        template = "{{name.middle|blank>N/A}}";
        result = Mark.up(template, context);
        expect(result).toEqual("N/A");
    });

    it("resolves pipe: empty", function () {
        template = "{{if name.middle|empty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{if fax|empty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{if children|empty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");
    });

    it("resolves pipe: notempty", function () {
        template = "{{if name.middle|notempty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if fax|notempty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if children|notempty}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: limit", function () {
        template = "{{brothers|limit>1}}{{.}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack");

        template = "{{brothers|limit>1>1}}{{.}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Joe");
    });

    it("resolves pipe: more", function () {
        template = "{{if brothers|more>3}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: ormore", function () {
        template = "{{if brothers|ormore>3}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        expect(Mark.up("{{n|more>123}}", {n: 124})).toEqual("124");
        expect(Mark.up("{{n|more>125}}", {n: 124})).toEqual("false");
        expect(Mark.up("{{n|more>123}}", {n: "124"})).toEqual("124");
        expect(Mark.up("{{n|more>125}}", {n: "124"})).toEqual("false");
        expect(Mark.up("{{n|more>a}}", {n: "b"})).toEqual("b");
        expect(Mark.up("{{n|more>c}}", {n: "b"})).toEqual("false");
        expect(Mark.up("{{n|ormore>b}}", {n: "b"})).toEqual("b");
    });

    it("resolves pipe: less", function () {
        template = "{{if brothers|less>3}}{{.}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: orless", function () {
        template = "{{if brothers|orless>3}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");
    });

    it("resolves pipe: between", function () {
        template = "{{if brothers|between>1>100}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{if brothers|between>50>100}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if age|between>30>40}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{if age|between>40>50}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: equals", function () {
        template = "{{if age|equals>33.3}}{{age}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("33.3");
    });

    it("resolves pipe: notequals", function () {
        template = "{{if age|notequals>33.3}}{{age}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: like", function () {
        template = "{{if name.first|like>Jo*}}{{name.last}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Doe");

        template = "{{if name.first|like>Adam}}{{name.first}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if name.first|like>john}}{{name.first}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("John");
    });

    it("resolves pipe: notlike", function () {
        template = "{{if name.first|notlike>Jo*}}{{name.first}}{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: trim", function () {
        template = "{{alias|trim}}";
        result = Mark.up(template, context);
        expect(result).toEqual("J. Doe");
    });

    it("resolves pipe: pack", function () {
        template = "{{greet|pack}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Top of the morning");
    });

    it("resolves pipe: upcase", function () {
        template = "{{name.first|upcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("JOHN");
    });

    it("resolves pipe: capcase", function () {
        template = "{{motto|capcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Life Is Like A Box Of Chocolates");
    });

    it("resolves pipe: downcase", function () {
        template = "{{name.first|downcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("john");
    });

    it("resolves pipe: chop", function () {
        template = "{{name.first|chop>1}}";
        result = Mark.up(template, context);
        expect(result).toEqual("J...");

        template = "{{name.first|chop>100}}";
        result = Mark.up(template, context);
        expect(result).toEqual("John");
    });

    it("resolves pipe: tease", function () {
        template = "{{motto|tease>3}}";
        result = Mark.up(template, context);
        expect(result).toEqual("life is like...");

        template = "{{motto|tease>50}}";
        result = Mark.up(template, context);
        expect(result).toEqual("life is like a box of chocolates");
    });

    it("resolves pipe: round", function () {
        template = "{{age|round}}";
        result = Mark.up(template, context);
        expect(result).toEqual("33");
    });

    it("resolves pipe: size/length", function () {
        template = "{{sisters|size}}";
        result = Mark.up(template, context);
        expect(result).toEqual("2");

        template = "{{children|size}}";
        result = Mark.up(template, context);
        expect(result).toEqual("0");

        template = "{{name.first|size}}";
        result = Mark.up(template, context);
        expect(result).toEqual("4");

        template = "{{name.last|length}}";
        result = Mark.up(template, context);
        expect(result).toEqual("3");

        template = "{{sisters}}{{#|size}}{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("22");

        template = "{{sisters}}{{##|size}}{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("22");
    });

    it("resolves pipe: clean", function () {
        template = "{{link|clean}}";
        result = Mark.up(template, context);
        expect(result).toEqual("example.com");
    });

    it("resolves pipe: reverse", function () {
        template = "{{brothers|reverse}}";
        result = Mark.up(template, context);
        expect(result).toEqual("JimJoeJack");
    });

    it("resolves pipe: join", function () {
        template = "{{brothers|join}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack,Joe,Jim");

        template = "{{brothers|join>-}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack-Joe-Jim");
    });

    it("resolves pipe: sort", function () {
        template = "{{brothers|sort|join}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack,Jim,Joe");

        template = "{{sisters|sort>name}}*{{name}}*{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("*Jen**Jill*");

        template = "{{sisters|sort>name|reverse}}*{{name}}*{{/sisters}}";
        result = Mark.up(template, context);
        expect(result).toEqual("*Jill**Jen*");
    });

    it("resolves pipe: choose", function () {
        template = "{{age|more>30|choose>Old>Young}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Old");

        template = "{{age|less>30|choose>Old>Young}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Young");

        template = "{{zip|empty|choose>unzippy>zippy}}";
        result = Mark.up(template, context);
        expect(result).toEqual("zippy");

        template = "{{gender|equals>male|choose>M}}";
        result = Mark.up(template, context);
        expect(result).toEqual("M");

        template = "{{gender|equals>female|choose>F}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");
    });

    it("resolves pipe: toggle", function () {
        template = "{{gender|toggle>male,female>M,F}}";
        result = Mark.up(template, context);
        expect(result).toEqual("M");

        template = "{{weight|toggle>135,145,155>Small,Medium,Large}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Medium");

        template = "{{weight|toggle>100,300>Skinny,Fat>N/A}}";
        result = Mark.up(template, context);
        expect(result).toEqual("N/A");
    });

    it("resolves pipe: fix", function () {
        template = "{{age|fix>3}}";
        result = Mark.up(template, context);
        expect(result).toEqual("33.300");
    });

    it("resolves pipe: mod", function () {
        template = "{{weight|mod>50}}";
        result = Mark.up(template, context);
        expect(result).toEqual("45");
    });

    it("resolves pipe: divisible", function () {
        template = "{{if weight|divisible>5}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{if weight|more>200|divisible>5}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if weight|divisible>7}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{if falsy|divisible>7}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{n}}{{if ##|more>5|divisible>3}}{{##}}{{/if}}.{{/n}}";
        result = Mark.up(template, {n:[1,2,3,4,5,6,7,8,9,10,11,12]});
        expect(result).toEqual(".....6...9...12.");
    });

    it("resolves pipe: even", function () {
        template = "{{num|even}}";
        result = Mark.up(template, {num: 222});
        expect(result).toEqual("222");

        template = "{{num|even}}";
        result = Mark.up(template, {num: 333});
        expect(result).toEqual("false");
    });

    it("resolves pipe: odd", function () {
        template = "{{num|odd}}";
        result = Mark.up(template, {num: 222});
        expect(result).toEqual("false");

        template = "{{num|odd}}";
        result = Mark.up(template, {num: 333});
        expect(result).toEqual("333");
    });

    it("resolves pipe: number", function () {
        template = "{{num|number}}";
        result = Mark.up(template, {num: "$1,234.56"});
        expect(result).toEqual("1234.56");

        template = "{{num|number}}";
        result = Mark.up(template, {num: "25px"});
        expect(result).toEqual("25");

        template = "{{num|number}}";
        result = Mark.up(template, {num: "-25px"});
        expect(result).toEqual("-25");
    });

    it("resolves pipe: url", function () {
        template = "{{path|url}}";
        result = Mark.up(template, context);
        expect(result).toEqual("example.com?a=b%20c=d");
    });

    it("resolves pipe: bool", function () {
        template = "{{name.first|empty|bool}}";
        result = Mark.up(template, context);
        expect(result).toEqual("false");

        template = "{{name.first|notempty|bool}}";
        result = Mark.up(template, context);
        expect(result).toEqual("true");

        template = "{{brothers|empty|bool}}";
        result = Mark.up(template, context);
        expect(result).toEqual("false");
    });

    it("resolves pipe: first", function () {
        template = "{{brothers}}{{if #|first}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack");

        template = "{{brothers}}{{if ##|first}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack");

        template = "{{brothers|reverse}}{{if #|first}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jim");
    });

    it("resolves pipe: last", function () {
        template = "{{brothers}}{{if #|last}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jim");

        template = "{{brothers|reverse}}{{if #|last}}{{.}}{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack");
    });

    it("resolves pipe: falsy", function () {
        template = "{{if falsy|falsy}}***{{/if}}";
        result = Mark.up(template, context);
        expect(result).toEqual("***");

        template = "{{brothers}}{{.}}{{if #|last|falsy}}@{{/if}}{{/brothers}}";
        result = Mark.up(template, context);
        expect(result).toEqual("Jack@Joe@Jim");
    });

    it("resolves pipe: call", function () {
        function Doggy() {
            this.TYPE_MUTT = "Mutt";

            this.greet = function () {
                return "Woof!";
            };

            this.getBreed = function (name) {
                return !!name ? this.TYPE_MUTT : "N/A";
            };
        }

        template = "{{doggy|call>greet}}";
        result = Mark.up(template, {doggy: new Doggy()});
        expect(result).toEqual("Woof!");

        template = "{{doggy|call>greet|upcase}}";
        result = Mark.up(template, {doggy: new Doggy()});
        expect(result).toEqual("WOOF!");

        template = "{{doggy|call>getBreed}}";
        result = Mark.up(template, {doggy: new Doggy()});
        expect(result).toEqual("N/A");

        template = "{{doggy|call>getBreed>Milo}}";
        result = Mark.up(template, {doggy: new Doggy()});
        expect(result).toEqual("Mutt");

        template = "{{doggy|call>getBreed>Milo|call>toLowerCase}}";
        result = Mark.up(template, {doggy: new Doggy()});
        expect(result).toEqual("mutt");

        template = "{{a|call>toPrecision>5}}";
        result = Mark.up(template, {a:1, b:2, c:3});
        expect(result).toEqual("1.0000");

        template = "{{a|call>join>*}}";
        result = Mark.up(template, {a:["ad","am","ma","rk"]});
        expect(result).toEqual("ad*am*ma*rk");

        template = "{{a|call>getFullYear|equals>2011|choose>Yes>No}}";
        result = Mark.up(template, {a:new Date(2011,1,1)});
        expect(result).toEqual("Yes");

        template = "{{a|call>getFullYear|more>2020|choose>Yes>No}}";
        result = Mark.up(template, {a:new Date(2011,1,1)});
        expect(result).toEqual("No");
    });

    it("resolves pipe: set", function () {
        template = "{{gender|upcase|set>gen}}";
        result = Mark.up(template, context);
        expect(result).toEqual("");

        template = "{{gen}} {{gen|downcase}}";
        result = Mark.up(template, context);
        expect(result).toEqual("MALE male");

        template = "{{_chars}}{{.|set>char}}{{char}}{{.}},{{/char}}-{{/_chars}}";
        result = Mark.up(template, context);
        expect(result).toEqual("a,b,c,-d,e,f,-");
    });

    it("resolves multidimensional array", function () {
        template = "{{_chars}}{{.|reverse}}{{.|upcase}}{{/.}}{{/_chars}}";
        result = Mark.up(template, context);
        expect(result).toEqual("CBAFED");
    });
    
    it("resolves self-reference iteration without overshooting", function() {
        template = "{{.}}{{name}} {{/.}}{{lala}}";
        result = Mark.up(template, context.sisters);
        expect(result).toEqual("Jill Jen xyz");
    });

    it("resolves backtick expressions", function () {
        Mark.pipes.plus = function (num, n) {
            return num + (+n);
        };

        Mark.pipes.plusplus = function (num, n1, n2) {
            return num + (+n1) + (+n2);
        };

        Mark.pipes.times = function (num, n) {
            return num * (+n);
        };

        template = "{{name}} ... {{age|plus>`base`}}";
        result = Mark.up(template, { name: "Adam", base: 10, age: 35 });
        expect(result).toEqual("Adam ... 45");        

        template = "{{name}} ... {{age|plusplus>`base`>`base`}}";
        result = Mark.up(template, { name: "Adam", base: 10, age: 35 });
        expect(result).toEqual("Adam ... 55");        
        
        template = "{{name}} ... {{age|plus>`base.n`}}";
        result = Mark.up(template, { name: "Adam", base: { n: 5 }, age: 35 });
        expect(result).toEqual("Adam ... 40");
        
        template = "{{base|set>BASE}}{{name}} ... {{age|plus>`BASE`}}";
        result = Mark.up(template, { name: "Adam", base: 100, age: 35 });
        expect(result).toEqual("Adam ... 135");
        
        template = "{{name}} ... {{age|plus>`base.n|times>100`}}";
        result = Mark.up(template, { name: "Adam", base: { n: 10 }, age: 35 });
        expect(result).toEqual("Adam ... 1035");

        Mark.includes.base = "10000";

        template = "{{name}} ... {{age|plus>`base`}}";
        result = Mark.up(template, { name: "Adam", base: 999, age: 35 });
        expect(result).toEqual("Adam ... 10035");

        template = "{{num|plus>1}}";
        result = Mark.up(template, {}, { globals: { num: 1000 } });
        expect(result).toEqual("1001");

        // whoa
        template = "{{age|`method`>1}}";
        result = Mark.up(template, { name: "Adam", method: "plus", age: 35 });
        expect(result).toEqual("36");

        template = "{{age|`method`>1}}";
        result = Mark.up(template, { name: "Adam", method: "minus", age: 34 });
        expect(result).toEqual("34");
    });

    it("resolves pipe: pluralize", function () {
        Mark.includes = {
            hello_msg: "Hi {{name}}! {{apples_msg|pluralize>`apples`}}",
            apples_msg: "You have one apple. ;; You have {{apples}} apples."
        };

        template = "<p>{{hello_msg}}</p>";

        result = Mark.up(template, { name: "Adam", apples: 5 });

        expect(result).toEqual("<p>Hi Adam! You have 5 apples.</p>");

        result = Mark.up(template, { name: "Adam", apples: 1 });

        expect(result).toEqual("<p>Hi Adam! You have one apple.</p>");
    });

});
