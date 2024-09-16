"use strict";

//wait for a process to end properly

module.exports = function(child, fail = true) {
  return new Promise(function(accept, reject) {
    child.once("error", reject);
    child.once("close", function(code) {
      if(code !== 0 && fail)
        return reject("Invalid process exit code");
      accept(code);
    });
  });
};
