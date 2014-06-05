nyks provide a set of "missing" stuffs in nodejs basic api.
All thoses function will eventually end up in the official API :-).


# Natives

## child_process
* require('child_process').exec_window(cmd, args, callback);

child_process.exec equivalent for windowed applications.


## fs
* require('fs').deleteFolderRecursive(path);
Recurive folder deletion


# Natives
## Buffer
* Buffer.prototype.indexOf(byte)
Binary search of byte
Return -1 if not found


## String
* String.prototype.startsWith(str)
Return boolean

* String.prototype.endsWith(str)
Return boolean


* String.prototype.stripEnd(str)
Return trimed string of "str" if present (else, leave untouched)


# zero_functions
* bool(val)
Return boolean value of *val with "f", "false", "n" and "no" casted as "false" (case insensitive)
