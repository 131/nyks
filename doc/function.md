# Function

Function utilities

------

## Table of Contents

  * [cache()](#cache)
  * [detach()](#detach)
  * [once()](#once)
  * [promisify()](#promisify)
  * [sleep()](#sleep)
  * [thunk()](#thunk)
  * [unary()](#unary)

------

<a name="cache"></a>
## cache(fn) : Function

Protect a function, cache & debounce multiple calls with same parameter.

```javascript
const cache = require('nyks/function/cache');

let iterator = 0;

function test(str) {
  cost++;
  return str.toUpperCase();
}

let ctest = cache(reverse);

// cost = 0

creverse("summer"); // return "SUMMER"

// cost = 1

creverse("summer"); // return "SUMMER"

// cost = 1

creverse("winter"); // return "WINTER"

// cost = 2
```

------

<a name="detach"></a>
## detach(fn, bind) : Function

Wrap a closure in nextTick.

```javascript
const detach = require('nyks/function/detach');

let a = 0;
let b = function(i) { a += i; };
let c = detach(b);

b(1); // a = 1
c(2); // a = 1
```

------

<a name="once"></a>
## once(fn) : Function

Ensure a closure is only called once.

```javascript
const once = require('nyks/function/once');

let a = 0;
let b = function() { a += 1; };
let c = once(b);

// a = 0

b(); b();

// a = 2

c(); c();

// a = 3
```

------

<a name="promisify"></a>
## promisify(fn[, ctx]) : Function

Convert a node style fn to a promise.

```javascript
const promisify = require('nyks/function/promisify');

let sayHello = function(str, err, cb) {
  setTimeout(function() {
    cb(err, "Hello " + str);
  });
};

let fn  = promisify(sayHello);

(async function() {
  await fn("world", null);    // return "Hello world"

  await fn("world", "error"); // this will throw with message "error"
})();
```

------

<a name="sleep"></a>
## sleep(timeout) : Promise

Alias of [async/sleep](../README-async.md#sleep).

```javascript
const sleep = require('nyks/function/sleep');

(async function() {
  let after = Date.now();

  await sleep(1000);

  let after = Date.now();

  // after - befor == 1000
})();
```

------

<a name="thunk"></a>
## thunk(resolve, reject) : Function

Promise resolution thunk.

```javascript
const thunk = require('nyks/function/thunk');

let errorMessage = "this is error";
let mockData     = "this is mock data";

new Promise(function(resolve, reject) {
  var cb = thunk(resolve, reject);
  cb(null, mockData); // return "this is mock data"
});


new Promise(function(resolve, reject) {
  var cb = thunk(resolve, reject);
  cb(errorMessage, mockData);
}); // this will throw with message "this is error"
```

------

<a name="unary"></a>
## unary(cb) : Function

Wrap a closure so it's called with only one parameter (un-curry).

```javascript
const unary = require('nyks/function/unary');

let a = function() { return arguments.length; };
let b = unary(a);

a(1, 2); // return 2
b(1, 2); // return 1
```
