"use strict";

//st exupery style

module.exports = function(thunk, workers) {
  var workerChain = [];

  var process = async function(task) {
    await pickworker();
    var ret = await thunk.call(this, task);
    freeworker();
    return Promise.resolve(ret);
  };

  var pickworker = function () {
    if(!workers) //no available worker, waiting
      return new Promise(function(resolve) {
        workerChain.push(resolve);
      });
    return Promise.resolve(workers--); //worker id
  };

  var freeworker = function() {
    workers++;
    if(workerChain.length)
      workerChain.shift()(pickworker());
  };

  var out  = process;  // better candidate than {}
  out.push = process; // per compatibility
  return out;
};
