<a name="top"></a>

* # Array
  * [nyks/array/pickIn](./array.md#pickIn)   - Return the needed value from the Array (return the first index of the Array if not found).
  * [nyks/array/reindex](./array.md#reindex) - Take an Array of Objects as entry and return an Object indexed by propName.
  * [nyks/array/sum](./array.md#sum)         - Return the sum of all items of an Array.

* # Async
  * [Async dedicated documentation](../README-async.md)

* # Buffer
  * [nyks/buffer/fromASCII](./buffer.md#fromASCII) - Return an Array of ASCII codes from a String.
  * [nyks/buffer/fromInt](./buffer.md#fromInt)     - Convert Int to Buffer.
  * [nyks/buffer/indexOf](./buffer.md#indexOf)     - Binary search of byte. Return -1 if not found.
  * [nyks/buffer/readUInt](./buffer.md#readUInt)   - Convert Buffer to Int.
  * [nyks/buffer/writeBits](./buffer.md#writeBits) - Write Bits in a Bytes composed source.

* # Child process
   * [nyks/child_process/exec](./child_process.md#exec)         - child_process.exec equivalent with sane API for arguments.
   * [nyks/child_process/passthru](./child_process.md#passthru) - Like exec, but with stdout & stderr bound to current process IO streams.
   * [nyks/child_process/wait](./child_process.md#wait)         - Wait for a process to end properly.

* # Collection
  * [nyks/collection/mask](./collection.md#mask)       - Format a collection to a mask sprintf(mask, k, v). Do it on keys if asked too.
  * [nyks/collection/reindex](./collection.md#reindex) - Re-index a collection on the specified index (and pluck, if needed).

* # Color
  * [nyks/color/Int2RGBA](./color.md#Int2RGBA) - Return an Object with Red Green Blue Alpha values from an Integer.
  * [nyks/color/RGB2HTML](./color.md#RGB2HTML) - Return an Hexadecimal code from an array of rgba values.
  * [nyks/color/RGBA2Int](./color.md#RGBA2Int) - Return an Integer value from an array of rgba values.

* # Crypto
  * [nyks/crypto/md5](./crypto.md#md5)                 - Return the md5 digest of a buffer/utf-8 string.
  * [nyks/crypto/openssh2pem](./crypto.md#openssh2pem) - Return the PEM version of an openssh public key (yeah !).
  * [nyks/crypto/pemme](./crypto.md#pemme)             - Create a PEM encoded armor around a desired string (chunk size 65).
  * [nyks/crypto/sha1](./crypto.md#sha1)               - Return the sha1 digest of a buffer/utf-8 string.

* # Date
  * [nyks/date/getSeason](./date.md#getSeason) - Return the current season of a Date object.
  * [nyks/date/strftime](./date.md#strftime)   - Extended mout/date/strftime.

* # Fs
  * [nyks/fs/copyFile](./fs.md#copyFile)                           - Copy a file to another. 
  * [nyks/fs/deleteFolderRecursive](./fs.md#deleteFolderRecursive) - Recursive folder deletion (sync).
  * [nyks/fs/filemtimeSync](./fs.md#filemtimeSync)                 - Return a file mtime, sync (usefull for collection/map).
  * [nyks/fs/filesizeSync](./fs.md#filesizeSync)                   - Return a file size, sync (usefull for collection/map).
  * [nyks/fs/isDirectorySync](./fs.md#isDirectorySync)             - Check if a path is a directory, sync (usefull as filter).
  * [nyks/fs/isFileSync](./fs.md#isFileSync)                       - Check if a path is a file, sync (usefull as filter).
  * [nyks/fs/JSON](./fs.md#JSON)                                   - Read a JSON file, return its parsed content (sync).
  * [nyks/fs/md5File](./fs.md#md5File)                             - Callback version of a basic async md5 file digest.
  * [nyks/fs/md5FileSync](./fs.md#md5FileSync)                     - Return md5 checksum of a file (sync).
  * [nyks/fs/mkdirpSync](./fs.md#mkdirpSync)                       - Create a directory (at any depth) sync.
  * [nyks/fs/patchJSON](./fs.md#patchJSON)                         - Apply a callback on an Object, write it on a differente target if specified.
  * [nyks/fs/readFileJSONSync](./fs.md#readFileJSONSync)           - Alias of [JSON](./fs.md#JSON).
  * [nyks/fs/rmrf](./fs.md#rmrf)                                   - Spawn a process that use real rmrf command (depend on the OS).
  * [nyks/fs/sha1File](./fs.md#sha1File)                           - Callback version of a basic async sha1 file digest.
  * [nyks/fs/tmppath](./fs.md#tmppath)                             - Return a unique, self-deletable, file path in OS temp dir.
  * [nyks/fs/writeLazySafeSync](./fs.md#writeLazySafeSync)         - Like fs.writeFileSync, but check if it needs to be updated before doing it.

* # Function
  * [nyks/function/cache](./function.md#cache)         - Protect a function, cache & debounce multiple calls with same parameter.
  * [nyks/function/detach](./function.md#detach)       - Wrap a closure in nextTick.
  * [nyks/function/once](./function.md#once)           - Ensure a closure is only called once.
  * [nyks/function/promisify](./function.md#promisify) - Convert a node style fn to a promise.
  * [nyks/function/sleep](./function.md#sleep)         - Alias of [async/sleep](../README-async.md#sleep).
  * [nyks/function/thunk](./function.md#thunk)         - Promise resolution thunk.
  * [nyks/function/unary](./function.md#unary)         - Wrap a closure so it's called with only one parameter (un-curry).

* # Http
  * [nyks/http/fetch](./http.md#fetch)             - Convert 'nyks/http/get' function into a Promise.
  * [nyks/http/get](./http.md#get)                 - Call http/https.get, depending on the enpoint Url.
  * [nyks/http/getContents](./http.md#getContents) - Get a file content, as a Buffer, through an endpoint Url.
  * [nyks/http/request](./http.md#request)         - Helper for http/https.request.
  * ## Http Headers
    * [nyks/http/header/parse](./http.md#parse)    - Return an Object of parsed headers (or cookies).

* # Lang
  * [nyks/lang/toBool](./lang.md#toBool) - Return the Boolean value of a String (usefull for prompts).

* # Math
  * [nyks/math/log2](./lang.md#log2)   - Returns the base 2 logarithm of a number.
  * [nyks/math/log10](./lang.md#log10) - Returns the base 10 logarithm of a number.

* # Object
  * [nyks/object/combine](./object.md#combine)       - Creates an object by using one array for keys and another for its values.
  * [nyks/object/difference](./object.md#difference) - Create an Array of keys that are different between two objects.
  * [nyks/object/indexOf](./object.md#indexOf)       - Return the matched key of an Object from the current value, return null if not found.
  * [nyks/object/jsonpath](./object.md#jsonpath)     - Return the value of an object through a specific path (with / as a separator).
  * [nyks/object/mask](./object.md#mask)             - Format a dictionnary to a mask sprintf(mask, k, v).
  * [nyks/object/sort](./object.md#sort)             - Return a new Object with only specified keys.

* # Os
  * [nyks/os/iswsl](./os.md#iswsl)     - Return true if we are in the Linux Subsystem on Windows.
  * [nyks/os/wslpath](./os.md#wslpath) - Convert Unix and Windows format paths.

* # Path
  * [nyks/path/extend](./path.md#extend) - Extend system PATH with new directories.
  * [nyks/path/jail](./path.md#jail)     - Like path.join, but throw when attempting escape.
  * [nyks/path/url](./path.md#url)       - Return a path with a file:// scheme syntax.
  * [nyks/path/which](./path.md#which)   - Search for a binary in env PATH.

* # Process
  * [nyks/process/formatArgs](./process.md#formatArgs) - Convert an Object of params to an Array of parsed command line args.
  * [nyks/process/parseArgs](./process.md#parseArgs)   - Command line args parser, aligned on yks patterns.
  * [nyks/process/splitArgs](./process.md#splitArgs)   - Split a string into whitespace separated chunks.

* # Promise
  * [nyks/promise/defer](./promise.md#defer)     - Used to interface Asynchronous functions, callback-based (read [NodeJS q defer documentaiton](https://github.com/kriskowal/q#using-deferreds)).
  * [nyks/promise/nodeify](./promise.md#nodeify) - Callbackify a Promise...

* # Require
  * [nyks/require/lookup](./require.md#lookup)   - Return the module a file belong to.
  * [nyks/require/resolve](./require.md#resolve) - Simple / portable alternative to require.resolve.

* # Stream
  * [nyks/stream/drain](./stream.md#drain)           - Drain a stream, return the contents as a buffer.
  * [nyks/stream/fromBuffer](./stream.md#fromBuffer) - Return a readable stream from a buffer.
  * [nyks/stream/pipe](./stream.md#pipe)             - Pipe a stream to another.

* # String
  * [nyks/string/capitalize](./string.md#capitalize)         - Capitalize the first letter of a string.
  * [nyks/string/chunk](./string.md#chunk)                   - Split a string into chunk of specified size.
  * [nyks/string/crc32](./string.md#crc32)                   - Crc32 of current string.
  * [nyks/string/format](./string.md#format)                 - Lite equivalent for util.format/sprintf (from util.format).
  * [nyks/string/hexToRgb](./string.md#hexToRgb)             - Convert Hexadecimal color code to RGB array.
  * [nyks/string/prettyFileSize](./string.md#prettyFileSize) - Return a pretty format of Bytes.
  * [nyks/string/repeat](./string.md#repeat)                 - Nothing fancy, alternative to mout.
  * [nyks/string/replaces](./string.md#replaces)             - Replace collection in current string.
  * [nyks/string/rot13](./string.md#rot13)                   - Rot13 of current string.
  * [nyks/string/rreplaces](./string.md#rreplaces)           - Recursive (iterative) replaces.
  * [nyks/string/sprintf](./string.md#sprintf)               - Sprintf as you think it is (like format, but more complete).
  * [nyks/string/stripEnd](./string.md#stripEnd)             - Strip string pattern at end (complete mout/string/endsWith).
  * [nyks/string/stripStart](./string.md#stripStart)         - Strip string pattern at beginning (complete mout/string/startsWith).
  * [nyks/string/truncate](./string.md#truncate)             - Truncate string to fixed length.
