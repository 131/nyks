Control flow ala ES7 async/await with async.js (v2) signatures


# Motivation
[nyks/async](https://github.com/131/nyks/tree/master/async) provide javascript async/await equivalent signatures of the excellent [async](https://github.com/caolan/async) workflow library. 


Module are exported in standard commonJS module format and written in strict format. (no transpilation required nor used).
Use browserify if you need nyks/async modules in a browser environnement.


**nyks/async** is not a wrapper on **async**, but rather leverages the full potential of native async/await & promises contract. Code tend to be small & very efficient (far more simplier than using callbacks), just give [nyks/async/queue.js](https://github.com/131/nyks/tree/master/async/queue.js) a look


## Addition to the async library signatures / promise pooling
* Async functions cannot use arrow function binding style, yet it might be usefull to bind nyks/async closure, therefore, you can use an extra optional args to all signature to set async function binding context. (i.e. as in native [.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) )
* Per design, it's easy to "throttle" a function that return a Promise ; checkout the "throttle" API for a way to make an ultra simple http request pooling.
* async logic allow async/each to iterate through array AND objects. Per design sanify, nyks/async does not. Use each/eachLimit/eachSeries for arrays, eachOf/eachOfLimit/eachOfSeries for collections.

# API

## nyks/async/eachLimit(arr, concurrency, *thunk [, thisobj])
Nothing special here
## nyks/async/eachSeries(arr, *thunk [, thisobj] )
// = eachLimit concurrency = 1
## nyks/async/each(arr, *thunk [, thisobj])
// = eachLimit concurrency = arr.length

## nyks/async/eachOfLimit (dict, concurrency, *thunk [, thisobj])
Nothing special here neither

## nyks/async/eachOfSeries(dict, *thunk [, thisobj])
 // = eachOfLimit concurrency = 1

## nyks/async/eachOf(dict, *thunk [, thisobj])
// = eachOfLimit concurrency = dict.length


```
const eachLimit    = require('nyks/async/eachLimit');

(async function() {

  var stuffs = [1,2,3, 5, 7]

  await eachLimit(stuffs, 2, function*(id){
    await dootherStuffs(id);
  });

})();
```

## nyks/async/setImmediate(fn)
Call a function in javascript next tick (using setImmediate API, or timeout 0 pollyfill)


## q = nyks/async/queue(*thunk, concurrency)
Return a QueueObject you can push task into.
### await q.push(task)
Wait for thunk to process task (wait for worker, if needed)

```
const queue    = require('nyks/async/queue');
const fetch    = require('node-fetch');

var q = queue(fetch, 1); //let's be nice

(async function() {
  await q.push("http://example.com/stuff.json");
})();

(async function() {
  await q.push("http://example.com/otherstuff.json"); //will wait for stuff to be retrieved
})();
```

## nyks/async/throttle
Throttle any function that return a promise, sugar syntax helper for nyks/async/queue


```
const throttle = require('nyks/async/throttle');
var  fetch     = require('node-fetch');
fetch = throttle(fetch, 1); //make fetch behave nicely

(async function() {
  await fetch("http://example.com/stuff.json");
})();

(async function() {
  await fetch("http://example.com/otherstuff.json"); //will wait for stuff.json to be retrieved
})();
```
# Tests
nyks/async is tested against async test suite (of course)


# TODO
* Get rich or die tryin'
* write a working nyks/async/cargo (see [the challenge on stackoverflow](http://stackoverflow.com/questions/39069624))

# Credits
* [131](https://github.com/131)
* not dependant upon, yet relying on [co](https://github.com/tj/co)
* inspired from the excellent [async](https://github.com/caolan/async)

## Alternatives / relatives
* [koa-async](https://github.com/eladnava/koa-async) ; a clever Promisify wrapper on top of async (but  not leveraging the full potential of ES7 async/await capabilities)
* [caolan/async/asyncify.js](https://github.com/caolan/async/blob/master/lib/asyncify.js) goes the same as koa-async.
* [es6-promise-pool](https://github.com/timdp/es6-promise-pool) ; equivalent to nyks/async/queue, with a different API



# Shoutbox, keywords, SEO love
async/await, co, nyks/async, promise, Promises, yield, async, queue, map, throttle, "Let's have a beer & talk in Paris"



