"use strict";

module.exports = function nextTick() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 0);
  });
};
