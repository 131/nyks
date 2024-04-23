"use strict";

const sleep = require('./sleep');

const retryUntil = async function(thunk, timeout, delay, error) {
  let stop = process.uptime() + timeout / 1000;

  do {
    let res = await thunk();
    if(res)
      return res;
    await sleep(delay);

  } while(process.uptime() < stop);

  throw (error || `Timeout`);
};

module.exports = retryUntil;
