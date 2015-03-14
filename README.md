nyks provide a set of "missing" stuffs in nodejs basic api.
All those functions will eventually end up in the official API :-).


# Natives

## child_process
* require('child_process').exec_window(cmd, args, callback);
child_process.exec equivalent for windowed applications.

* require('child_process').passthru(cmd, args, callback);
* require('child_process').passthru(cmd, {args:args,env:env}, callback);
callback(err, exit_code, last_stdout_line);


## path
* path.which
Return full path of a binary in env PATH
* path.extend_PATH(path[,path2, ..]);
Extend system PATH with new directory

## util
* require('util').md5(string)
Return a hex encoded md5 hash
* require('util').parseargs(process.argv.splice(2))
Command line args parser, aligned on yks patterns


## fs
* require('fs').deleteFolderRecursive(path);
Recursive folder deletion

* require('fs').md5File(file_path, callback)
* require('fs').md5FileSync(file_path)
Return md5 checksum of a file

* require('fs').filesizeSync(path);
* require('fs').filemtimeSync(path);
* require('fs').isFileSync(path)
* require('fs').isDirectorySync(path)

* require('fs').tmppath (ext)
Return a unique file path in OS temp dir

* require('fs').renameCross(src, dest, callback)
Rename src to dest (even on cross devices)

## http
* require('http').downloadFile(url, file_path, callback)
Download a remote file to a local file

* require('http').json(url, callback)
Fetch a remote JSON object



# Natives
## Object
* Object.sort(obj, keys)
Return a new object based on obj's existings keys (see Object.subset)

* Object.column(obj, column_key, index_key)
Column mode of obj (see http://php.net/manual/fr/function.array-column.php)

* Object.set(obj, k, v)
Set an object property value (mostly for callback/map usage)

* Object.mask_join(obj, glue, mask)
Apply join(glue, map(obj, util.format(mask, k, v)));


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

* String.prototype.rot13()
Rot13 of current string

* String.prototype.trimchars(chars)
Trim (from begining & end) specific chars from a string


# zero_functions
* bool(val)
Return boolean value of *val with "f", "false", "n" and "no" casted as "false" (case insensitive)

* guid()
Return a guid
