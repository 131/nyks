"use strict";

const eachLimit = require('./eachLimit');

module.exports = async function(series, n, thunk, ctx) {

  var res = {};
  await eachLimit(Object.keys(series), n, async function(k) {
    res[k] = await thunk.call(ctx || this, series[k], k);
  }, ctx);
  return res;
};

