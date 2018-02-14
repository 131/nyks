# Array

Array utilities

------

## Table of Contents

  * [pickIn()](#pickIn)
  * [reindex()](#reindex)
  * [sum()](#sump)

------

<a name="pickIn"></a>
## pickIn(value, arr) : *

Return the needed value from the Array (return the first index of the Array if not found).

```javascript
const pickIn = require('nyks/array/pickIn');

pickIn('b', ['a', 'b', 'c']); // return 'b'

pickIn('z', ['a', 'b', 'c']); // return 'a'
```

------

<a name="reindex"></a>
## reindex(arr, propName) : Object

Take an Array of Objects as entry and return an Object indexed by propName.

```javascript
const reindex = require('nyks/array/reindex');

var people = [
  {name : 'Jean', 'age' : 18},
  {name : 'Claude', 'age' : 22}
];

reindex(people, 'name');
/*
  return {
    'Claude' : {name : 'Claude', 'age' : 22},
    'Jean'   : {name : 'Jean', 'age' : 18}
  }
*/
```

------

<a name="sum"></a>
## sum(arr) : Int|Float

Return the sum of all items of an Array.

```javascript
const sum = require('nyks/array/sum');

sum([1, 2, 3]); // return 6

sum([]); // return 0
```
