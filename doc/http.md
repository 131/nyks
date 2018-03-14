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
## request(url[, data], callback) : void

Helper for http/https.request.

```javascript
const request = require('nyks/http/request');

let target = 'http://endpoint.com/services'; // you can also use an parsed Url
let data   = {
  name : 'Jean Lebon'
};

request(target, data, async function(err, data) {
  // err might be null
  // data can be drained
});

/*
  You have multiple options here :

    * You can pass GET arguments in Url.
    * Passing an jar entry in parsed Url Object will create cookies from this jar.
    * Target.method can be forced.
    * you can passe query string in parsed Url Object, it will write GET parametters automatically (for ex : target.qs = {name : 'Jean'}).
*/
```

------

<a name="parse"></a>
## header/parse(str) : Object

Return an Object of parsed headers (or cookies).
