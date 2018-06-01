"use strict";

const sleep = require('./sleep');

const setLoop = async (task, delay, reject) => {

  do {
    var start = Date.now();
    try {
      await task();
    } catch(err) {
      if(!reject)
        throw err;
      reject(err);
    }
    var duration = Date.now() - start;

    await sleep(Math.max(delay - duration, 200));
  } while(true);
};

module.exports = setLoop;
