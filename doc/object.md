# Object

Object utilities

------

## Table of Contents

  * [combine()](#combine)
  * [difference()](#difference)
  * [indexOf()](#indexOf)
  * [jsonpath()](#jsonpath)
  * [mask()](#mask)
  * [sort()](#sort)

------

<a name="combine"></a>
## combine(keys, values) : Object

Creates an object by using one array for keys and another for its values.

```javascript
const combine = require('nyks/object/combine');

// do something
```

------

<a name="difference"></a>
## difference(obj1, obj2) : Array

Create an Array of keys that are different between two objects.

```javascript
const difference = require('nyks/object/difference');

// do something
```

------

<a name="indexOf"></a>
## indexOf(obj, val) : String

Return the matched key of an Object from the current value, return null if not found.

```javascript
const indexOf = require('nyks/object/indexOf');

// do something
```

------

<a name="jsonpath"></a>
## jsonpath(obj, path) : any

Return the value of an object through a specific path (with / as a separator).

```javascript
const jsonpath = require('nyks/object/jsonpath');

// do something
```

------

<a name="mask"></a>
## mask(obj, mask, glue) : Array

Format a dictionnary to a mask sprintf(mask, k, v).

```javascript
const mask = require('nyks/object/mask');

// do something
```

------

<a name="sort"></a>
## sort(obj, keys) : Object

Return a new Object with only specified keys.

```javascript
const sort = require('nyks/object/sort');

// do something
```
