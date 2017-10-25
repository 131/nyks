"use strict";

const sleep = require('./sleep');

/*eslint no-unsafe-finally: "off"*/
var throttle = function(gn, period) {
  var runnig =  false;
  var mustRerunnif = false;

  return async function loop() {
    if(runnig) {
      mustRerunnif = arguments;
      return;
    }

    try {
      runnig = true;
      await gn.apply(null, arguments);
    } finally {

      if(period)
        await sleep(period);

      runnig = false;
      if(!mustRerunnif)
        return;

      var args = mustRerunnif;
      mustRerunnif = false;
      await loop.apply(null, args);
    }
  };
};

module.exports = throttle;
