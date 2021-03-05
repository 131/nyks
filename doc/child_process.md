# Child Process

Child Process utilities

------

## Table of Contents

  * [exec()](#exec)
  * [passthru()](#passthru)
  * [wait()](#wait)

------

<a name="exec"></a>
## promise exec(cmd[, args[, options]]) : ChildProcess

Promised version of child_process.spawn.

```javascript
const exec = require('nyks/child_process/exec');

await exec("hostname") == os.hostname();

```

------

<a name="passthru"></a>
## promise passthru(cmd[, args[, options]]) : void

Like exec, but with stdout & stderr bound to current process IO streams.

```javascript
const passthru = require('nyks/child_process/passthru');

await passthru("node", ['-e', 'process.exit()'])


passthru("node", ['-e', 'process.exit(33)']);
//throw "Bad exit code 33"
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
