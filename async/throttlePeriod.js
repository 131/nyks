"use strict";



var throttle = function(gn , period) {
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
        await new Promise(function(resolve){ setTimeout(resolve, period);});

      runnig = false;
      if(!mustRerunnif)
        return;

      var args = mustRerunnif;
      mustRerunnif = false;
      await loop.apply(null, args);
    }
  }
}

module.exports = throttle;