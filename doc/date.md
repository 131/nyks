# Date

Date utilities

------

## Table of Contents

  * [getSeason()](#getSeason)
  * [strftime()](#strftime)

------

<a name="getSeason"></a>
## getSeason() : String

Return the current season of a Date object.

```javascript
const getSeason = require('nyks/date/getSeason');

getSeason(new Date('2016-04-01')); // return "spring";
getSeason(new Date('2016-07-01')); // return "summer";
getSeason(new Date('2016-10-01')); // return "autumn";
getSeason(new Date('2016-12-31')); // return "winter";
```

------

<a name="strftime"></a>
## strftime() : 

Extended mout/date/strftime.

```javascript
const strftime = require('nyks/date/strftime');

let date = new Date('2016-01-01');

strftime(date, '%d') // return "01", like mout strftime would do


/*
  The two new parametters are :

  * %v : Return the first day of the Date() Week.
  * %E : Return the Season of the Date().
*/

strftime(date, '%E') // return "winter";
```
