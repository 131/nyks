# Http

Http utilities

------

## Table of Contents

  * [fetch()](#fetch)
  * [get()](#get)
  * [getContents()](#getContents)
  * [request()](#request)
  * [header/parse()](#parse)

------

<a name="fetch"></a>
## fetch(url) : Promise

Convert 'get' function into a Promise.

```javascript
const fetch = require('nyks/http/fetch');

// do something
```

------

<a name="get"></a>
## get(url[, callback]) : void

Call http/https.get, depending on the enpoint Url.

```javascript
const get = require('nyks/http/get');

// do something
```

------

<a name="getContents"></a>
## getContents(src[, callback]) : void

Get a file content, as a Buffer, through an endpoint Url.

```javascript
const getContents = require('nyks/http/getContents');

// do something
```

------

<a name="request"></a>
## request(url[, data], callback) : void

Helper for http/https.request.

```javascript
const request = require('nyks/http/request');

// do something
```

------

<a name="parse"></a>
## header/parse(str) : Object

Return an Object of parsed headers (or cookies).

```javascript
const parse = require('nyks/http/header/parse');

// do something
```
