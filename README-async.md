# Async

Control flow ala ES7 async/await with async.js (v2) signatures

------

## Table of Contents

  * [Motivation](#Motivation)
  * [API](#API)
    * [eachLimit()](#eachLimit)
    * [eachOfLimit()](#eachOfLimit)
    * [each()](#each)
    * [eachOf()](#eachOf)
    * [eachSeries()](#eachSeries)
    * [eachOfSeries()](#eachOfSeries)
    * [retryUntil()](#retryUntil)
    * [sleep()](#sleep)
    * [timeout()](#timeout)
    * [setImmediate()](#setImmediate)
    * [queue()](#queue)
    * [throttle()](#throttle)
  * [Tests](#Tests)
  * [TODO](#TODO)
  * [Credits](#Credits)
  * [Alternatives / relatives](#Alternatives)
  * [Shoutbox, keywords, SEO love](#keywords)

------

<a name="Motivation"></a>
# Motivation

[nyks/async](./async/) provide javascript async/await equivalent signatures of the excellent [async](https://github.com/caolan/async) workflow library.

Module are exported in standard commonJS module format and written in strict format. (no transpilation required nor used).
Use browserify if you need nyks/async modules in a browser environnement.

**nyks/async** is not a wrapper on **async**, but rather leverages the full potential of native async/await & promises contract. Code tend to be small & very efficient (far more simplier than using callbacks), just give [nyks/async/queue.js](./async/queue.js) a look.


## Addition to the async library signatures / promise pooling

* Async functions cannot use arrow function binding style, yet it might be usefull to bind nyks/async closure, therefore, you can use an extra optional args to all signature to set async function binding context. (i.e. as in native [.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) )
* Per design, it's easy to "throttle" a function that return a Promise ; checkout the "throttle" API for a way to make an ultra simple http request pooling.
* async logic allow async/each to iterate through array AND objects. Per design sanify, nyks/async does not. Use each/eachLimit/eachSeries for arrays, eachOf/eachOfLimit/eachOfSeries for collections.

------

<a name="API"></a>
# API

<a name="eachLimit"></a>
## eachLimit(arr, concurrency, thunk [, thisobj]) : Promise

Applies the function 'thunk' to each item in 'arr', in parallel, with a limit async operations of 'concurrency' at a time. The 'thunk' is called with an item from the Array 'arr'.

```javascript
const eachLimit = require('nyks/async/eachLimit');

(async function() {

  var stuffs = [1, 2, 3, 5, 6];

  await eachLimit(stuffs, 2, async function(id) {
    await dootherStuffs(id);
  });

})();
```

------

<a name="eachOfLimit"></a>
## eachOfLimit(dict, concurrency, thunk [, thisobj]) : Promise

Applies the function 'thunk' to each item of 'dict', in parallel, with a limit async operations of 'concurrency' at a time. The 'thunk' is called with an item from the Object 'dict'. 

```javascript
const eachOfLimit = require('nyks/async/eachOfLimit');

(async function() {

  var stuffs = {
    'number' : 1,
    'number' : 2,
    'number' : 3,
    'number' : 4
  };

  await eachOfLimit(stuffs, 2, async function(id, key) {
    await dootherStuffs(id);
  });

})();
```

------

<a name="each"></a>
## each(arr, thunk [, thisobj]) : Promise

Like eachLimit with a concurrency of arr.length.

```javascript
const each = require('nyks/async/each');

(async function() {

  var stuffs = [1, 2, 3, 5, 6];

  await each(stuffs, async function(id) {
    await dootherStuffs(id);
  });

})();
```

------

<a name="eachOf"></a>
## eachOf(dict, thunk [, thisobj]) : Promise

Like eachOfLimit with a concurrency of dict.length.

```javascript
const eachOf = require('nyks/async/eachOf');

(async function() {

  var stuffs = {
    'number' : 1,
    'number' : 2,
    'number' : 3,
    'number' : 4
  };

  await eachOf(stuffs, async function(id, key) {
    await dootherStuffs(id);
  });

})();
```

------

<a name="eachSeries"></a>
## eachSeries(arr, thunk [, thisobj]) : Function

Like eachLimit with a concurrency of 1.

```javascript
const eachSeries = require('nyks/async/eachSeries');

(async function() {

  var stuffs = [1, 2, 3, 5, 6];

  await eachSeries(stuffs, async function(id) {
    await dootherStuffs(id);
  });

})();
```

------

<a name="eachOfSeries"></a>
## eachOfSeries(dict, thunk [, thisobj]) : Function

Like eachOfLimit with a concurrency of 1.

```javascript
const eachOfSeries = require('nyks/async/eachOfSeries');

(async function() {

  var stuffs = {
    'number' : 1,
    'number' : 2,
    'number' : 3,
    'number' : 4
  };

  await eachOfSeries(stuffs, async function(id, key) {
    await dootherStuffs(id);
  });

})();
```

------

<a name="retryUntil"></a>
## retryUntil(thunk, timeout, delay, [, failure]) : Function

Run thunk until it resolves a truthy value, until timeout is reached. Wait **delay** between each attempt. On timeout, reject with a generic "Timeout" error message (or the specified failure, if any).

```javascript
const retryUntil = require('nyks/async/retryUntil');

(async function() {

  await tryUntil(async () => {
    return net.connect(...)
  }, 60 * 1000, 1000, 'Could not connect to remote socket');

})();
```




<a name="sleep"></a>
## sleep(delay) : Promise

setTimeout as a promise.

```javascript
const sleep = require('nyks/async/sleep');

(async function() {

  // this is now
  await sleep(2000);
  // this is now + 2 secondes

})();
```

------

<a name="timeout"></a>
## timeout(delay, [, reason]) : Promise

return a Promise that reject after delay (with reason = 'timeout')

```javascript
const timeout = require('nyks/async/timeout');

(async function() {
  await timeout(1000); // this will throw with message 'timeout'
})();
```

------

<a name="setImmediate"></a>
## setImmediate(fn) : Function

Call a function in javascript next tick (using setImmediate API, or timeout 0 pollyfill)

```javascript
const setImmediate = require('nyks/async/setImmediate');

(async function() {

  // this is now
  await setImmediate();
  // this is still now...

})();
```

------

<a name="queue"></a>
## queue(thunk, concurrency) : Object

Return a QueueObject you can push task into.
Wait for thunk to process task (wait for worker, if needed).

```javascript
const fetch = require('node-fetch');
const queue = require('nyks/async/queue');

var q = queue(fetch, 1); //let's be nice

(async function() {
  await q.push("http://example.com/stuff.json");
})();

(async function() {
  await q.push("http://example.com/otherstuff.json"); //will wait for stuff to be retrieved
})();
```

------

<a name="throttle"></a>
## throttle(thunk, concurrency) : Function

Throttle any function that return a promise, sugar syntax helper for nyks/async/queue.

```javascript
const fetch    = require('node-fetch');
const throttle = require('nyks/async/throttle');

fetch = throttle(fetch, 1); //make fetch behave nicely

(async function() {
  await fetch("http://example.com/stuff.json");
})();

(async function() {
  await fetch("http://example.com/otherstuff.json"); //will wait for stuff.json to be retrieved
})();
```

------

<a name="Tests"></a>
# Tests
nyks/async is tested against async test suite (of course)

------

<a nam="TODO"></a>
# TODO
* Get rich or die tryin'
* write a working nyks/async/cargo (see [the challenge on stackoverflow](http://stackoverflow.com/questions/39069624))

------

<a name="Credits"></a>
# Credits
* [131](https://github.com/131)
* inspired from the excellent [async](https://github.com/caolan/async)
* Derived from [async-co](https://github.com/131/async-co)

------

<a name="Alternatives"></a>
# Alternatives / relatives
* [koa-async](https://github.com/eladnava/koa-async); a clever Promisify wrapper on top of async (but  not leveraging the full potential of ES7 async/await capabilities)
* [caolan/async/asyncify.js](https://github.com/caolan/async/blob/master/lib/asyncify.js); goes the same as koa-async.
* [es6-promise-pool](https://github.com/timdp/es6-promise-pool); equivalent to nyks/async/queue, with a different API

------

<a name="keywords"></a>
# Shoutbox, keywords, SEO love
async/await, co, nyks/async, promise, Promises, yield, async, queue, map, throttle, "Let's have a beer & talk in Paris"
