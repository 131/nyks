# Lang

Lang utilities

------

## Table of Contents

  * [toBool()](#toBool)

------

<a name="toBool"></a>
## toBool(str) : Boolean

Return the Boolean value of a String (usefull for prompts).

```javascript
const toBool = require('nyks/lang/toBool');

toBool(0); // return false
toBool(""); // return false

// false value are : null, 0, "false", false, "f", "n", "no"

toBool("yes") // return true
toBool(true); // return true
```
