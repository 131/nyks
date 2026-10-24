# Object

Object utilities

------

## Table of Contents

  * [combine()](#combine)
  * [dive()](#dive)
  * [difference()](#difference)
  * [freeze()](#freeze)
  * [indexOf()](#indexOf)
  * [jsonpath()](#jsonpath)
  * [mask()](#mask)
  * [sort()](#sort)

------

<a name="dive"></a>
## dive(obj, ...parts) : Object

Dive an object to a specific path, spliting parts using dots '.', hence this function is drop-in compliant with mout/object/get.

```javascript
const dive = require('nyks/object/dive');

let obj   = [0, [{"foo" : { "bar" : {"color" : "blue" }}}]];

dive(obj, 1, 0, "foo", "bar.color");
/*
  return "blue"
*/
```

------

<a name="combine"></a>
## combine(keys, values) : Object

Creates an object by using one array for keys and another for its values.

```javascript
const combine = require('nyks/object/combine');

let keys   = ["france", "italy", "usa"];
let values = ["baguette", "pizza", "hamburger"];

combine(keys, values);
/*
  return {
    "france" : "baguette",
    "italy"  : "pizza",
    "usa"    : "hamburger"
  }
*/
```

------

<a name="difference"></a>
## difference(obj1, obj2) : Array

Create an Array of keys that are different between two objects.

```javascript
const difference = require('nyks/object/difference');

let obj1 = {a : 5, c : 2, d : "aa"};
let obj2 = {b : 3, c : 2, d : "a"};

difference(obj1, obj2); // return ["a", "b", "d"];
```

------

<a name="freeze"></a>
## freeze(obj) : Object

Freeze freshly parsed JSON/configuration data recursively in place and return
the same reference. Uses Object.freeze and Object.values: nested objects and
arrays are frozen, primitives and already frozen objects are returned as is.

```javascript
const freeze = require('nyks/object/freeze');

const config = freeze({env: {map: {NAME: 'Alice'}}});
Object.isFrozen(config.env.map); // true
// config.env.map.NAME = 'Bob'; // throws in strict mode
```

This does not clone. Freeze is applied before visiting children, so repeated
references and cycles terminate. This is not a general object-graph freezer:
use JSON data without getters, symbol properties or special object types.
Clone separately when a mutable working copy is needed.

------

<a name="indexOf"></a>
## indexOf(obj, val) : String

Return the matched key of an Object from the current value, return null if not found.

```javascript
const indexOf = require('nyks/object/indexOf');

let obj = {
  "france" : "baguette",
  "italy"  : "pizza",
  "usa"    : "hamburger"
};

indexOf(obj, "pizza"); // return "italy";
indexOf(obj, "melon"); // return null;
```

------

<a name="jsonpath"></a>
## jsonpath(obj, path) : *

Return the value of an object through a specific path (with / as a separator).

```javascript
const jsonpath = require('nyks/object/jsonpath');

let obj = {
  "france" : "baguette",
  "italy"  : {"food" : "pizza" },
  "usa"    : "hamburger"
};

jsonpath(obj, "/italy/food"); // return "pizza"
```

------

<a name="mask"></a>
## mask(obj, mask, glue) : Array

Format a dictionnary to a mask sprintf(mask, k, v).

```javascript
const mask = require('nyks/object/mask');

let obj = {
  "france" : "baguette",
  "italy"  : "pizza",
  "usa"    : "hamburger"
};

mask(obj, "In %s we eat %s", ". ") // return "In france we eat baguette. In italy we eat pizza. In usa we eat hamburger"
```

------

<a name="sort"></a>
## sort(obj, keys) : Object

Return a new Object with only specified keys.

```javascript
const sort = require('nyks/object/sort');

let obj = {
  "france" : "baguette",
  "italy"  : "pizza",
  "usa"    : "hamburger"
};

sort(keys, ["france", "italy"]); //return {"france" : "baguette", "italy" : "pizza"}
```
