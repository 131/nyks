# Child Process

Child Process utilities

------

## Table of Contents

  * [exec()](#exec)
  * [passthru()](#passthru)
  * [wait()](#wait)

------

<a name="exec"></a>
## exec(cmd[, options], callback) : ChildProcess

child_process.exec equivalent with sane API for arguments.

```javascript
const exec = require('nyks/child_process/exec');

exec("node", ['-e', "console.log('Hello world');"], function(err, stdout, stderr) {
  // err is null;
  // stdout is "Hello world";
  // stderr is null;
});

exec("node", ['-e', "console.error(22);process.exit(42);"], function(err, stdout, stderr) {
  // err is 42;
  // stdout is null;
  // stderr is 22;
});
```

------

<a name="passthru"></a>
## passthru(cmd[, args], callback) : void

Like exec, but with stdout & stderr bound to current process IO streams.

```javascript
const passthru = require('nyks/child_process/passthru');

passthru("node", ['-e', 'process.exit()'], function(err, exit) {
  // err is null;
  // exit is 0;
});

passthru("node", ['-e', 'process.exit(33)'], function(err, exit) {
  // err is "Bad exit code 33";
  // exit is 33;
});
```

------

<a name="wait"></a>
## wait(child_process) : Promise

Wait for a process to end properly.

```javascript
const spawn = require('child_process').spawn;
const wait  = require('nyks/child_process/wait');

(async function() {

  var result  = await wait(spawn('node', ['-e', 'process.exit(0)']));
  // wait doesn't return any stdout
  // result is undefined


  await wait(spawn('node', ['-e', 'process.exit(1)']));
  // this exemple throw "Invalid process exit code"

})();
```
