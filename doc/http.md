# Http

Http utilities

------

## Table of Contents

  * [fetch()](#fetch)
  * [get()](#get)
  * [request()](#request)
  * [header/parse()](#parse)

------

<a name="fetch"></a>
## fetch(url) : Promise

Convert 'get' function into a Promise.

```javascript
const fetch = require('nyks/http/fetch');

(async function() {
  await fetch('http://endpoint.com/services'); // return readable stream or throw
})();
```

------

<a name="get"></a>
## get(url[, callback]) : void

Call http/https.get, depending on the enpoint Url.

```javascript
const url = require('url');

const get = require('nyks/http/get');

get(url.parse('http://endpoint.com/services'), function(res) {
  // res can be drained
});

// works with https endpoint too
get(url.parse('https://endpoint.com/services'), function(res) {
  // res can be drained
});

// works with url as string too
get('http://endpoint.com/services', function(res) {
  // res can be drained
});
```

------

<a name="request"></a>
## request(url[, data]) : Promise

Helper for http/https.request.

```javascript
const request = require('nyks/http/request');

let target = 'http://endpoint.com/services'; // you can also use an parsed Url
let data   = {
  name : 'Jean Lebon'
};

const res = await request(target, data);
// res can be drained
// you need to check for the statusCode yourself, or pass {expect : 200} in the target

/*
  You have multiple options here :

    * You can pass GET arguments in Url.
    * Passing an jar entry in parsed Url Object will create cookies from this jar.
    * Target.method can be forced.
    * you can passe query string in parsed Url Object, it will write GET parametters automatically (for ex : target.qs = {name : 'Jean'}).
*/
```


`reqtimeout` is the response deadline in milliseconds (default: 60000). It starts
when the request has been sent and covers both response headers and body reading.
On expiry, the request and response are destroyed with an `Error` whose `code` is
`ETIMEDOUT`. The timer is cleared when the response completes or closes, or when
the request fails. Each followed redirect uses the configured timeout.

```javascript
const url = require('url');
const drain = require('nyks/stream/drain');

const res = await request({...url.parse(target), reqtimeout: 5000}, data);
const body = await drain(res);
```

With `expect`, an unexpected status rejects with an error exposing `res` and
`err`; callers can read `error.res` with `drain`. The response deadline also
covers that body. An upgrade resolves `{res, socket, upgradeHead}` and transfers
the socket's lifetime to the caller.

------

<a name="parse"></a>
## header/parse(str) : Object

Return an Object of parsed headers (or cookies).
