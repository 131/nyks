"use strict";

//st exupery style

module.exports = function(thunk, workers) {

  var process = async function() {
    await pickworker();
    var ret = await thunk.apply(this, arguments);
    freeworker();
    return Promise.resolve(ret);
  };

  var out         = process;  // better candidate than {}
  out.push        = process; // per compatibility
  out.workerChain = [];

  var pickworker = function () {
    if(!workers) //no available worker, waiting
      return new Promise(function(resolve) {
        out.workerChain.push(resolve);
      });
    return Promise.resolve(workers--); //worker id
  };

  var freeworker = function() {
    workers++;
    if(out.workerChain.length)
      out.workerChain.shift()(pickworker());
  };

  return out;
};
