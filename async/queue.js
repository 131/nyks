"use strict";

//st exupery style

module.exports = function(thunk, workers) {
  var workerChain = [];

  var process = async function() {
    await pickworker();
    var ret = await thunk.apply(this, arguments);
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

  var out    = process; // better candidate than {}
  out.push   = process; // per compatibility
  //out.getLength = () => { workerChain.length; };
  //out.filter = (cb) => { workerChain = workerChain.filter(cb); };
  out.drain = () => { workerChain = []; };

  return out;
};
