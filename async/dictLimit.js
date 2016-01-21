"use strict";
var async = require('async');


module.exports = function(keys, tasks, iterator, chain){
  var out = {}, errs = [];
  async.mapLimit(keys, tasks, function(item, chain) {
    iterator(item, function(err, result) {
      out[item] = err ? null : result;
      if(err) errs.push(err);
      chain();
    });
  }, function(){
    chain(errs.length ? errs : null, out);
  });
}
