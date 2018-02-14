# Path

Path utilities

------

## Table of Contents

  * [extend()](#extend)
  * [jail()](#jail)
  * [url()](#url)
  * [which()](#which)

------

<a name="extend"></a>
## extend(path[,path2][, ..]) : String

Extend system PATH with new directories.

```javascript
const extend = require('nyks/path/extend');
const which  = require('nyks/path/which');

// Meta exemple
extend(__dirname); // add __dirname files to process env path
which("path.md"); // return __filename value

```

------

<a name="jail"></a>
## jail(base, file_path) : String

Like path.join, but throw when attempting escape.

```javascript
const jail = require('nyks/path/jail');

jail(__dirname, "ab", "..", "cd"); return equivalent of path.join(__dirname, 'ab/../cd')
jail(__dirname, "../../etc/host"); this might throw with message /escape attempt/
```

------


<a name="url"></a>
## url(file_path) : String

Return a path with a file:// scheme syntax.

```javascript
const url = require('nyks/path/url');

url('path.md'); // return equivalent of path.join('file://', __dirname, 'path.md')
```

------

<a name="which"></a>
## which(bin) : String

Search for a binary in env PATH.

```javascript
const which  = require('nyks/path/which');
const extend = require('nyks/path/extend');

// Meta exemple
extend(__dirname); // add __dirname files to process env path
which("path.md"); // return __filename value
```
