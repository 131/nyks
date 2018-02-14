# Process

Process utilities

------

## Table of Contents

  * [formatArgs()](#formatArgs)
  * [parseArgs()](#parseArgs)
  * [splitArgs()](#splitArgs)

------

<a name="formatArgs"></a>
## formatArgs(args, is_unix) : Array

Convert an Object of params to an Array of parsed command line args.

```javascript
const formatArgs = require('nyks/process/formatArgs');

formatArgs({foo : 'foo', bar : 'bar'}); // return ["--foo=foo", "--bar=bar"]
formatArgs({foo : [1, 2, 3]}); // return ["--foo=1", "--foo=2", "--foo=3"]
```

------

<a name="parseArgs"></a>
## parseArgs([argv]) : Object

Command line args parser, aligned on yks patterns.

```javascript
const parseArgs = require('nyks/process/parseArgs');

parseArgs(["--foo"]); // return {args : [], dict : {foo : true}, rest : undefined}
parseArgs(["bar", "--foo", "baz"]); // return {args : ["bar", "baz"], dict : {foo : true}, rest : undefined}

// result of splitArgs('--foo=42 bar -- --this --is --unparsed') :
parseArgs([ '--foo=42', 'bar', '--', '--this --is --unparsed' ]); // return {args : ["bar"], dict : {foo : 42}, rest : "--this --is --unparsed"}

```

------

<a name="splitArgs"></a>
## splitArgs(str) : Array

Split a string into whitespace separated chunks.

```javascript
const splitArgs = require('nyks/process/splitArgs');

splitArgs("a 12 d"); // return ["a", 12, "d"]
splitArgs("a \"'b c'\" c  d") // return ["a", "'b c'", "c", "d"]
```
