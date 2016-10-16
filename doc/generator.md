# Generator #

generator *(kindof function)* utilities.

## func(name [, ..args] ):generator

Returns a generator that yield a generator with given `name` on supplied object.
Useful for iterators like `async-co/eachOf` and `async-co/each`.
Optional args are curried to generator call

```js
// will yield the method `delete()` for each `user`
var eachSeries = require('async-co/eachSeries');
yield eachSeries(users, func('delete'));
```


-------------------------------------------------------------------------------

For more usage examples check specs inside `/test` folder. Unit tests are the
best documentation you can get...
