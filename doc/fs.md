# Fs

Fs utilities

------

## Table of Contents

  * [copyFile()](#copyFile)
  * [copyFiles()](#copyFiles)
  * [deleteFolderRecursive()](#deleteFolderRecursive)
  * [filemtimeSync()](#filemtimeSync)
  * [filesizeSync()](#filesizeSync)
  * [isDirectorySync()](#isDirectorySync)
  * [isFileSync()](#isFileSync)
  * [JSON()](#JSON)
  * [md5File()](#md5File)
  * [md5FileSync()](#md5FileSync)
  * [mkdirpSync()](#mkdirpSync)
  * [patchJSON()](#patchJSON)
  * [readFileJSONSync()](#readFileJSONSync)
  * [rmrf()](#rmrf)
  * [readdir()](#readdir)
  * [sha1File()](#sha1File)
  * [tmppath()](#tmppath)
  * [writeLazySafeSync()](#writeLazySafeSync)




------

<a name="copyFile"></a>
## copyFile(source target, chain) : void

Copy a file to another.

```javascript
const fs = require('fs');

const copyFile = require('nyks/fs/copyFile');
const tmppath  = require('nyks/fs/tmppath');

let dest  = tmppath("tmp_package");
let from = require('../package.json');

copyFile(from, dest, function(err) {
  // err = null
  fs.readFileSync(dst); // return a copy of ./package.json content (from)
});
```

------

<a name="copyFile"></a>
## copyFiles(files_list target_dir[, options]) : void

Copy a list of files to a target directory. Options is an Object that can recieve cwd (default if process.cwd()) and process (callback that return the file content you want in the target dir).

```javascript
const glob = require('glob').sync;

const copyFiles = require('nyks/fs/copyFiles');

let files_list = glob('resources/**/*.css');
let target_dir = 'dist';
let header     = '/* Css file, property of myself */\n';

copyFiles(files_list, target_dir, {
  process : function(content, file_path, index) {
    console.log('file ' + file_path + ' has been copied and patched');
    return header + content;
  }
});
```

------

<a name="deleteFolderRecursive"></a>
## deleteFolderRecursive(path) : void

Recursive folder deletion (sync).

```javascript
const path = require('path');

const deleteFolderRecursive = require('nyks/fs/deleteFolderRecursive');
const mkdirpSync            = require('nyks/fs/mkdirpSync');

// Meta exemple
let dir  = path.join(root, "this/is/a/dir");

mkdirpSync(dir); // return dir

// path "this/is/a/dir" now exists

deleteFolderRecursive(dir);

// path "this/is/a/dir" now doesn't exists
```

------

<a name="filemtimeSync"></a>
## filemtimeSync(path) : Date

Return a file mtime, sync (usefull for collection/map).

```javascript
const filemtimeSync = require('nyks/fs/filemtimeSync');

filemtimeSync('../package.json'); // return package.json creation date
```

------

<a name="filesizeSync"></a>
## filesizeSync(path) : Int

Return a file size, sync (usefull for collection/map).

```javascript
const fs = require('fs');

const filesizeSync = require('nyks/fs/filesizeSync');

let file_name = "foo";
fs.writeFileSync(file_name, "bar");

filesizeSync(file_name); // return 3
```

------

<a name="isDirectorySync"></a>
## isDirectorySync(path) : Bool

Check if a path is a directory, sync (usefull as filter).

```javascript
const isDirectorySync = require('nyks/fs/isDirectorySync');

isDirectorySync('../package.json'); // return false
isDirectorySync('../fs'); // return true
```

------

<a name="isFileSync"></a>
## isFileSync(path) : Bool

Check if a path is a file, sync (usefull as filter).

```javascript
const isFileSync = require('nyks/fs/isFileSync');

isFileSync('../package.json'); // return true
isFileSync('../fs'); // return false
```

------

<a name="JSON"></a>
## JSON(path) : JSON

Read a JSON file, return its parsed content (sync).

```javascript
const json = require('nyks/fs/JSON');

json('../package.json') ;// return package.json content as an Object
```

------

<a name="md5File"></a>
## md5File(path, callback) : void

Callback version of a basic async md5 file digest.

```javascript
const fs = require('fs');

const md5File = require('nyks/fs/md5File');

let file_name = "foo";

fs.writeFileSync(file_name, "bar");

md5File(file_name, function(err, data) {
  // err  = null
  // data =  "37b51d194a7513e45b56f6524f2d51f2"
});
```

------

<a name="md5FileSync"></a>
## md5FileSync(path) : String

Return md5 checksum of a file.

```javascript
const fs = require('fs');

const md5FileSync = require('nyks/fs/md5FileSync');

let file_name = "foo";

fs.writeFileSync(file_name, "bar");

md5FileSync(file_name); // return "37b51d194a7513e45b56f6524f2d51f2"
```

------

<a name="mkdirpSync"></a>
## mkdirpSync(path) : String

Create a directory (at any depth) sync.

```javascript
const path = require('path');

const mkdirpSync            = require('nyks/fs/mkdirpSync');
const deleteFolderRecursive = require('nyks/fs/deleteFolderRecursive');

// Meta exemple
let dir  = path.join(root, "this/is/a/dir");

mkdirpSync(dir); // return dir

// path "this/is/a/dir" now exists

deleteFolderRecursive(dir);

// path "this/is/a/dir" now doesn't exists
```

------

<a name="patchJSON"></a>
## patchJSON(target, cb[, source]) : void

Apply a callback on an Object, write it on a differente target if specified.

```javascript
const patchJSON = require('nyks/fs/patchJSON');

let src = '../package.json';

patchJSON(src, function(body) {
  body.name = 'New ' + body.name;
});

// package.json name is now 'New nyks'

let target = '../new_package.json';

patchJSON(target, function(body) {
  body.name = body.name.replace('New ', 'Newest');
}, src);

// This created a new file 'new_package.json' with entry 'name' = 'Newest nyks'
```

------

<a name="readFileJSONSync"></a>
## readFileJSONSync(path) : JSON

Alias of [JSON](#JSON).

------

<a name="rmrf"></a>
## rmrf(path) : Promise

Spawn a process that use real rmrf command (depend on the OS).

```javascript
const path = require('path');

const rmrf = require('nyks/fs/rmrf');

let root = "trashme";
let dir  = path.join(root, "this/is/a/dir");
mkdirpSync(dir);

(async function() {
  await rmrf(root); // removed "trashme" directory and all its childs
})();

```

------

<a name="readdir"></a>
## * readdir(string dir) : RecursiveDirectoryIterator

list, recursiverly, all files in a directory through an iterator

```javascript

const readdir = require('nyks/fs/readdir');

for(var file_path of readdir("/path/to/huge/directory"))
  await md5computation(file_path);

```

------

<a name="sha1File"></a>
## sha1File(path, callback) : void

Callback version of a basic async sha1 file digest.

```javascript
const fs = require('fs');

const sha1File = require('nyks/fs/sha1File');

let file_name = "foo";

fs.writeFileSync(file_name, "bar");

sha1File(file, function(err, sha1) {
  // err  = null
  // sha1 = "62cdb7020ff920e5aa642c3d4066950dd1f01f4d"
});
```

------

<a name="tmppath"></a>
## tmppath(ext[, auto_trash][, length]) : String

Return a unique, self-deletable, file path in OS temp dir.

```javascript
const tmppath = require('nyks/fs/tmppath');

var tpath  = tmppath("json"); // create a tmp json file in tmp directory, depending on the OS
var tpath2 = tmppath("json", false); // same as tpath, but will not be deleted after process exit

process.exit();

// now tpath file doesn't exist anymore
// tpath2 still exists
```

------

<a name="writeLazySafeSync"></a>
## writeLazySafeSync(path, body) : Bool

Like fs.writeFileSync, but check if it needs to be updated before doing it.

```javascript
const fs = require('fs');

const writeLazySafeSync = require('nyks/fs/writeLazySafeSync');

let file_name = "foo";

writeLazySafeSync(file_name, "bar"); // this will act like fs.writeFileSync

writeLazySafeSync(file_name, "bar"); // this will not do anything, filemtime might not have change

writeLazySafeSync(file_name, "Melon"); // this will act like fs.writeFileSync
```
