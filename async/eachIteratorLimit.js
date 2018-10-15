"use strict";

const setImmediate  = require('./setImmediate');


const eachIteratorLimit = async function(series, n, thunk, ctx) {

  var ret = [];
  var cancel = false;
  var i = 0;

  var next = async function() {
    let {value, done} = series.next();

    if(done || cancel)
      return;

    //force async HERE, so we MIGHT stop replenishing after error
    await new Promise(setImmediate);

    try { //stop replenishing after error
      ret[i] = await thunk.call(ctx || this, value, i++);
    } catch(err) {
      cancel = true;
      throw err;
    }

    await next(); //continue in lane
  };

  var lanes = [];
  while(n--)
    lanes.push(next());

  await Promise.all(lanes);

  return ret;
};

module.exports = eachIteratorLimit;
