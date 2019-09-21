"use strict";

const sleep = require('./sleep');

const retryUntil = async function(thunk, timeout, delay, error) {
  let stop = Date.now() + timeout;

  do {
    let res = await thunk();
    if(res)
      return res;
    await sleep(delay);

  } while(Date.now() < stop);

  throw (error || `Timeout`);
};

module.exports = retryUntil;
