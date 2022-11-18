"use strict";

let max = 2147483647;

module.exports = async function sleep(timeout) {
  if(!timeout)
    return;

  /* istanbul ignore else */
  if(timeout <= max) {
    return new Promise(function(resolve) {
      setTimeout(resolve, timeout);
    });
  } else {
    let t = Math.floor(timeout / max), r = timeout % max;
    for(let i = 0; i < t; i++)
      await sleep(max);

    return sleep(r);
  }
};
