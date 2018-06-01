"use strict";
//st exupery style

module.exports = function(thunk, payload) {
  var tasks = [];
  var haswork;

  var process = function(task) {
    if(haswork)
      haswork();
    tasks.push(task);
  };

  var out = (async () => {
    do {
      var slice = tasks.splice(0, payload);

      if(slice.length) {
        await thunk(slice);
        continue;
      }

      await new Promise(resolve => haswork = resolve);
      haswork = null;
    } while(true);
  })();

  out.push   = process;

  return out;
};
