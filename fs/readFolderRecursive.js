"use strict";
var fs      = require('fs');
var path    = require('path');
var async   = require('async');
var forEach = require('mout/array/forEach');
var debounce= require('mout/function/debounce');
var diff    = require('mout/date/diff')

var  readStatRecursive = function(item, cb) {
  fs.lstat(item, function(err, stats) {
    if (!err && stats.isDirectory()) {
      fs.readdir(item, function(err, list) {
        if(!err)
          forEach(list , function(dirItem){
            readStatRecursive(path.join(item, dirItem), cb);
          })
      })
    }else {
      stats.file_path = item;
      cb(err, stats)
    }
  })
}

module.exports = function(dir_path, taskcb, endcb){
  var queue = async.queue(function(tasks, cb){
      if(tasks)
        taskcb(tasks);
      cb();
  }, 10);

  queue.push(null);

  readStatRecursive(dir_path , function(err , stats){
    queue.push(stats, function(err){
      if(err)
        endcb(err);
    })
  })

  queue.drain = debounce(function(){
    endcb();
  }, 50)
}
