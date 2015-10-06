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


## process
* require('nyks/process/parseArgs')(process.argv.splice(2))
Command line args parser, aligned on yks patterns
* require('nyks/process/splitArgs')("some string 'with escaped' content")
Split a string into whitespace separated chunks



## fs
* require('nyks/fs/deleteFolderRecursive')(path);
Recursive folder deletion

* require('nyks/fs/md5File')(file_path, callback)
* require('nyks/fs/md5FileSync')(file_path)
Return md5 checksum of a file

* require('nyks/fs/filesizeSync')(path);
* require('nyks/fs/filemtimeSync')(path);
* require('nyks/fs/isFileSync')(path)
* require('nyks/fs/isDirectorySync')(path)

* require('nyks/fs/tmppath')(ext)
Return a unique file path in OS temp dir




# Crypt
## Utils
* require('nyks/crypt/pemme')(str, armor)
Create a PEM encoded armor around a desired string (chunk size 65)

* require('nyks/crypt/md5') (body)
Return the base md5 bash

* require('nyks/crypt/openssh2pem')(body)
Return the PEM version of an openssh public key (yeah !)


# Natives
## Object
* require('nyks/object/combine')(keys, values)
Creates an object by using one array for keys and another for its values
* require('nyks/object/mask')({"foo":"bar"}, mask, glue )
Format a dictionnary to a mask sprintf(mask,  k, v)


## Buffer
* require('nyks/buffer/indexOf')(byte)
Binary search of byte
Return -1 if not found

## String

* require('nyks/string/chunk')(basestr, chunksize)
Split a string into chunk of specified size.


* require('nyks/string/startsWith')(str)
Return boolean

* require('nyks/string/endsWith')(str)
Return boolean


* require('nyks/string/replaces')(dict)
Replace key => value in current string

* require('nyks/string/rreplaces')(dict)
Recursive (iterative) replaces


* require('nyks/string/stripEnd')(str)
Return trimmed string of "str" if present (else, leave untouched)

* require('nyks/string/rot13')()
Rot13 of current string


