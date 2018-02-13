# OS

Os utilities

------

## Table of Contents

  * [iswsl()](#iswsl)
  * [wslpath()](#wslpath)

------

<a name="iswsl"></a>
## iswsl() : Boolean

return true if we are in the Linux Subsystem on Windows

```javascript
const iswsl = require('nyks/os/iswsl');

iswsl(); //return true if on wsl.
```

------

<a name="wslpath"></a>
## wslpath(type, path) : String

wslpath - Convert Unix and Windows format paths.


```javascript

const wslpath = require('nyks/os/wslpath');

wslpath("-w", "test/data/value"); // return test\data\value
wslpath("-u", "test\data\value"); // return test/data/value

['-u', '-w', '-m', '-r', '-s']

/*
  The tolerated types are :

  * -u : print Unix form of NAMEs (/mnt/c/Windows).
  * -w : print Windows form of NAMEs (C:\Windows).
  * -m : like --windows, but with regular slashes (C:/Windows).
  * -r : output absolute path with resolved symbolic links. 
  * -s : substitute Unix HOME path with Windows user path.
*/


```
