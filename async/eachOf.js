"use strict";

const eachOfLimit = require('./eachOfLimit');

module.exports = async function(series, thunk, ctx) {
  return await eachOfLimit(series, Object.keys(series).length, thunk, ctx);
};

