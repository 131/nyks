"use strict";

const fs        = require('fs');
const promisify = require('../function/promisify');

//from graceful-fs

// on Windows, A/V software can lock the directory, causing this
// to fail with an EACCES or EPERM if the directory contains newly
// created files.  Try again on failure, for up to 2 seconds.

let rename = fs.rename;

/*istanbul ignore next*/
if(process.platform === "win32") {

  rename = function(from, to, cb) {

    var start = Date.now();
    var backoff = 0;

    fs.rename(from, to, function CB(err) {
      //retry later
      if(err
          && (err.code === "EACCES" || err.code === "EPERM")
          && Date.now() - start < 60 * 1000) {

        setTimeout(function() {
          fs.rename(from, to, CB); //retry
        }, backoff);

        if(backoff < 100)
          backoff += 10;
        return;
      }
      if(cb)
        cb(err);
    });
  };

}

module.exports = promisify(rename);
