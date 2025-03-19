"use strict";

module.exports = function(thunk) {
  return new Promise((resolve, reject) => {
    thunk(function(err, result) {
      if(err)
        return reject(err);
      return resolve(result);
    });
  });
};
