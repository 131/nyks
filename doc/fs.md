# Fs

Fs utilities

------

## Table of Contents

  * [copyFile()](#copyFile)
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
  * [sha1File()](#sha1File)
  * [tmppath()](#tmppath)
  * [writeLazySafeSync()](#writeLazySafeSync)

------

<a name="copyFile"></a>
## copyFile(source target, chain) : void

Copy a file to another.

```javascript
const copyFile = require('nyks/fs/copyFile');

// do something
```

------

<a name="deleteFolderRecursive"></a>
## deleteFolderRecursive(path) : void

Recursive folder deletion (sync).

```javascript
const deleteFolderRecursive = require('nyks/fs/deleteFolderRecursive');

// do something
```

------

<a name="filemtimeSync"></a>
## filemtimeSync(path) : Date

Return a file mtime, sync (usefull for collection/map).

```javascript
const filemtimeSync = require('nyks/fs/filemtimeSync');

// do something
```

------

<a name="filesizeSync"></a>
## filesizeSync(path) : Int

Return a file size, sync (usefull for collection/map).

```javascript
const filesizeSync = require('nyks/fs/filesizeSync');

// do something
```

------

<a name="isDirectorySync"></a>
## isDirectorySync(path) : Bool

Check if a path is a directory, sync (usefull as filter).

```javascript
const isDirectorySync = require('nyks/fs/isDirectorySync');

// do something
```

------

<a name="isFileSync"></a>
## isFileSync(path) : Bool

Check if a path is a file, sync (usefull as filter).

```javascript
const isFileSync = require('nyks/fs/isFileSync');

// do something
```

------

<a name="JSON"></a>
## JSON(path) : JSON

Read a JSON file, return its parsed content (sync).

```javascript
const json = require('nyks/fs/JSON');

// do something
```

------

<a name="md5File"></a>
## md5File(path, callback) : void

Callback version of a basic async md5 file digest.

```javascript
const md5File = require('nyks/fs/md5File');

// do something
```

------

<a name="md5FileSync"></a>
## md5FileSync(path) : String

Return md5 checksum of a file.

```javascript
const md5FileSync = require('nyks/fs/md5FileSync');

// do something
```

------

<a name="mkdirpSync"></a>
## mkdirpSync(path) : String

Create a directory (at any depth) sync.

```javascript
const mkdirpSync = require('nyks/fs/mkdirpSync');

// do something
```

------

<a name="patchJSON"></a>
## patchJSON(target, cb[, source]) : void

Apply a callback on an Object, write it on a differente target if specified.

```javascript
const patchJSON = require('nyks/fs/patchJSON');

// do something
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
const rmrf = require('nyks/fs/rmrf');

// do something
```

------

<a name="sha1File"></a>
## sha1File(path, callback) : void

Callback version of a basic async sha1 file digest.

```javascript
const sha1File = require('nyks/fs/sha1File');

// do something
```

------

<a name="tmppath"></a>
## tmppath(ext[, auto_trash][, length]) : String

Return a unique, self-deletable, file path in OS temp dir.

```javascript
const tmppath = require('nyks/fs/tmppath');

// do something
```

------

<a name="writeLazySafeSync"></a>
## writeLazySafeSync(path, body) : Bool

Like fs.writeFileSync, but check if it needs to be updated before doing it.

```javascript
const writeLazySafeSync = require('nyks/fs/writeLazySafeSync');

// do something
```
