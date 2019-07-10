"use strict";

module.exports = (delay, reason) => {
  return new Promise((resolve, reject) => {
    setTimeout(reject.bind(this, reason || 'timeout'), delay);
  });
};
