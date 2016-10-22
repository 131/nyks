# Javascript natives
* object
* array

* string
** nyks/string/chunk - split string in constant length parts
** nyks/string/format - lite equivalent  for util.format/sprintf (from util.format)
** nyks/string/repeat - nothing fancy, alternative to mout
** nyks/string/replaces - replace collection in string
** nyks/string/rreplaces - recursive replace
** nyks/string/rot13 - perform rot13 transposition
** nyks/string/stripEnd - strip string pattern at end (complete mout/string/endsWith)
** nyks/string/stripStart - strip string pattern at beginning (complete mout/string/startsWith)
** nyks/string/truncate - truncate string to fixed length

* function
** nyks/function/detach - wrap a closure in nextTick
** nyks/function/once - ensure a closure is only called once
** nyks/function/promisify - convert a node style fn to a promise
** nyks/function/sleep - setTiemout as a promise
** nyks/function/thunk - promise resolution thunk
** nyks/function/unary - wrap a closure so it's called with only one parameter (un-curry)

* generator
**  nyks/generator/func - generator version of mout/function/func

* Collection
** nyks/collection/reindex - re-index a collection on the specified index (and pluck, if needed)


* Crypto
** nyks/crypto/md5 - return the md5 digest of a buffer/utf-8 string


# fs
** nyks/fs/md5File - callback version of a basic async md5 file digest 
** nyks/fs/sha1File - callback version of a basic async sha1 file digest 
** nyks/fs/copyFile - copy a file to another 
** nyks/fs/tmppath - return a temporary, self-deletable file
** nyks/fs/deleteFolderRecursive - empty a directory  (sync)
** nyks/fs/filemtimeSync - return a file mtime, sync (usefull for collection/map)
** nyks/fs/filesizeSync - return a file size, sync (usefull for collection/map)
** nyks/fs/isDirectorySync - check if a path is a directory, sync (usefull as filter)
** nyks/fs/isFileSync - check if a path is a file, sync (usefull as filter)
** nyks/fs/mkdirpSync - create a directory (at any depth) sync


# Path
** nyks/path/jail - like path.join, but throw when attempting escape

# Nodejs natives

* Buffer utilties


