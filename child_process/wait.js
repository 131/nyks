"use strict";

//wait for a process to end properly

module.exports = function(child){

  return new Promise(function(accept, reject){
    child.once("error", reject);

    child.once("close", function(result){
      if(result !== 0)
        return reject("Invalid process exit code");
      accept();
    });
  });

}