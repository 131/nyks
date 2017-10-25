"use strict";

const eachLimit = require('./eachLimit');

module.exports = async function(series, thunk, ctx) {
  return await eachLimit(series, series.length, thunk, ctx);
};

