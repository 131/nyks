"use strict";

//st exupery style

module.exports = function(thunk, workers = 1) {
  var workerChain = [], slots = workers;

  var process = async function() {
    await pickworker('push');
    var ret = await thunk.apply(this, arguments);
    freeworker();
    return ret;
  };

  var unshift = async function() {
    await pickworker('unshift');
    var ret = await thunk.apply(this, arguments);
    freeworker();
    return ret;
  };

  var pickworker = function (way) {
    if(!slots) //no available worker, waiting
      return new Promise(resolve => workerChain[way](resolve));

    return Promise.resolve(slots--); //worker id
  };

  var freeworker = function() {
    slots++;
    if(workerChain.length)
      workerChain.shift()(pickworker('push'));
    else if(slots == workers && process.drain)
      process.drain();
  };

  var out     = process; // better candidate than {}
  out.push    = process; // per compatibility
  out.unshift = unshift; // per compatibility
  //out.getLength = () => { workerChain.length; };
  //out.filter = (cb) => { workerChain = workerChain.filter(cb); };
  out.drain = Function.prototype;

  out.kill = () => {
    workerChain = [];
    out.drain = Function.prototype;
  };

  return out;
};
