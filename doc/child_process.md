* require('nyks/child_process/exec')(cmd, options, callback);
child_process.exec equivalent with sane API for arguments.

* require('nyks/child_process/passthru')(cmd, args, callback);
Like exec, but with stdout & stderr bound to current process IO streams.
