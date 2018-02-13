# Promise

Promise utilities

------

## Table of Contents

  * [defer()](#defer)
  * [nodeify()](#nodeify)

------

<a name="defer"></a>
## defer() : Promise

Used to interface Asynchronous functions, callback-based (read [NodeJS q defer documentation](https://github.com/kriskowal/q#using-deferreds)).

```javascript
const defer = require('nyks/promise/defer');

let defered = defer();

setTimeout(function() {
  defered.resolve("this is ok");
}, 10);

setTimeout(function() {
  defered.reject("this is not ok");
}, 20);

await defered; // return "this is ok"

// Using defer.resolve is like usine defer.chain(null, "this is ok");
// Using defer.reject is like usine defer.chain("this is not ok");

let defered_2 = defer();

setTimeout(function() {
  defered_2.resolve("this is ok");
}, 20);

setTimeout(function() {
  defered_2.reject("this is not ok");
}, 10);

await defered_2; // will throw "this is not ok"


```

------

<a name="nodeify"></a>
## nodeify(func) : Function

Callbackify a Promise...

```javascript
const nodeify = require('nyks/promise/nodeify');
const sleep   = require('nyks/function/sleep');

var lazyFunc = async function(int) {
  await sleep(500);
  return int * 2;
};

var worker = nodeify(lazyFunc);

worker(8, function(err, result) {
  // err    = null
  // result = 16
});
```
