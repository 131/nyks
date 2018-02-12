# Collection

Collections (Array or Objects) utilities

------

## Table of Contents

  * [mask()](#mask)
  * [reindex()](#reindex)

------

<a name="mask"></a>
## mask

Format a collection to a mask sprintf(mask, k, v). Do it on keys if asked too.

```javascript
const mask = require('nyks/collection/mask');

var data = {
  "france" : "baguette",
  "italy"  : "pizza",
  "usa"    : "hamburger"
};

mask(data, "we ate %s in %s");
// return {
  "france" : "we ate baguette in france",
  "italy"  : "we ate pizza in italy",
  "usa"    : "we ate hamburger in usa"
};

var data_2 = {
  "france" : "baguette",
  "italy"  : "pizza",
  "usa"    : "hamburger"
};

mask(data_2, "we ate %s in %s", "food_%s");
// return {
  "food_france" : "we ate baguette in france",
  "food_italy"  : "we ate pizza in italy",
  "food_usa"    : "we ate hamburger in usa"
}

mask(data_2,  null, "food_%s");
// return {
  "food_france" : "baguette",
  "food_italy"  : "pizza",
  "food_usa"    : "hamburger"
}
```

------

<a name="reindex"></a>
## reindex

Re-index a collection on the specified index (and pluck, if needed).

```javascript
const reindex = require('nyks/collection/reindex');

// do something
```
