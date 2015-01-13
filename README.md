nyks provide a set of "missing" stuffs in nodejs basic api.
All those functions will eventually end up in the official API :-).


# Natives

## child_process
* require('child_process').exec_window(cmd, args, callback);

child_process.exec equivalent for windowed applications.

## Date
* Date.now()
Return current unix timestamp, in seconds, as float

## fs
* require('fs').deleteFolderRecursive(path);
Recursive folder deletion

* require('fs').md5File(file_path, callback)
* require('fs').md5FileSync(file_path)
Return md5 checksum of a file

* require('fs').filesizeSync(path);
Filesize sync

* require('fs').tmppath (ext)
Return a unique file path in OS temp dir

* require('fs').renameCross(src, dest, callback)
Rename src to dest (even on cross devices)

## http
* require('http').downloadFile(url, file_path, callback)
Download a remote file


# Natives
## Object
* Object.sort(obj, keys)
Return a new object based on obj's existings keys

## Buffer
* Buffer.prototype.indexOf(byte)
Binary search of byte
Return -1 if not found

## Array
* Array.prototype.diff(array)
Exclude one array from another

## String
* String.prototype.startsWith(str)
Return boolean

* String.prototype.endsWith(str)
Return boolean


* String.prototype.replaces(dict)
Replace key => value in current string

* String.prototype.rreplaces(dict)
Recursive (iterative) replaces


* String.prototype.stripEnd(str)
Return trimmed string of "str" if present (else, leave untouched)


# zero_functions
* bool(val)
Return boolean value of *val with "f", "false", "n" and "no" casted as "false" (case insensitive)

* guid()
Return a guid
