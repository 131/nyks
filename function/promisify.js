"use strict";

/**
 * Convert a node style fn to a promise
 */

module.exports = function(fn) {
  var ctx = this;
  return function(){
    var args = [].slice.apply(arguments);

    return new Promise(function (resolve, reject) {
      args.push(function (err, res) {
        if (err) return reject(err);
        resolve(res);
      });
      fn.apply(ctx, args);
    });

  }
}