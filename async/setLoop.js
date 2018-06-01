"use strict";

const sleep = require('./sleep');

const setLoop = async (task, delay, reject) => {
  if(!reject)
    reject = console.log;

  do {
    var start = Date.now();
    try {
      await task();
    } catch(err) {
      reject(err);
    }
    var duration = Date.now() - start;

    await sleep(Math.max(delay - duration, 200));
  } while(true);
};

module.exports = setLoop;
