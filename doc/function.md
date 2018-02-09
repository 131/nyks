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

// do something
```

------

<a name="detach"></a>
## detach(fn, bind) : Function

Wrap a closure in nextTick.

```javascript
const detach = require('nyks/function/detach');

// do something
```

------

<a name="once"></a>
## once(fn) : Function

Ensure a closure is only called once.

```javascript
const once = require('nyks/function/once');

// do something
```

------

<a name="promisify"></a>
## promisify(fn[, ctx]) : Function

Convert a node style fn to a promise.

```javascript
const promisify = require('nyks/function/promisify');

// do something
```

------

<a name="sleep"></a>
## sleep(timeout) : Promise

Alias of [async/sleep](../README-async.md#sleep).

```javascript
const sleep = require('nyks/function/sleep');

// do something
```

------

<a name="thunk"></a>
## thunk(resolve, reject) : Function

Promise resolution thunk.

```javascript
const thunk = require('nyks/function/thunk');

// do something
```

------

<a name="unary"></a>
## unary(cb) : Function

Wrap a closure so it's called with only one parameter (un-curry).

```javascript
const unary = require('nyks/function/unary');

// do something
```
