"use strict";

const sleep = require('./sleep');

const setLoop = async (task, delay, reject) => {

  do {
    var start = process.uptime();
    try {
      await task();
    } catch(err) {
      if(!reject)
        throw err;
      reject(err);
    }
    var duration = (process.uptime() - start) * 1000;

    await sleep(Math.max(delay - duration, 200));
  } while(true);
};

module.exports = setLoop;
