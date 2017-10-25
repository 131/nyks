"use strict";

const setImmediate  = require('./setImmediate');

module.exports = async function(series, n, thunk, ctx) {
  n = Math.min(n || 5, series.length);

  var ret = [];
  var index = 0;
  var cancel = false;

  var next = async function() {
    if (index >= series.length || cancel)
      return;

    let i = index++;

    //force async HERE, so we MIGHT stop replenishing after error
    await new Promise(setImmediate);

    try { //stop replenishing after error
      ret[i] = await thunk.call(ctx || this, series[i], i);
    } catch(err) {
      cancel = true;
      throw err;
    }

    await next(); //continue in lane
  };

  var lanes = [];
  while (n--) {
    lanes.push(next());
  }

  await Promise.all(lanes);

  return ret;
};

