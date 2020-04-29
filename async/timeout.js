"use strict";

module.exports = (delay, reason) => {
  let b;
  let a = new Promise((resolve, reject) => {
    b = setTimeout(reject.bind(this, reason || 'timeout'), delay);
  });
  a.clearTimeout = () => { clearTimeout(b); };
  return a;
};
