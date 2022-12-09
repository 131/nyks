"use strict";

const guid = require('mout/random/guid');

const keepAliveMgr = function(drain, timeout = 1000) {
  let tasks = [];
  let opened = true;
  let timeouts = [];

  let close = function(task) {
    tasks = tasks.filter(t => t != task);
    let i = setTimeout(function() {
      timeouts = timeouts.filter(t => t != i);
      if(tasks.length != 0 || !opened)
        return;

      drain();
      opened = false;
    }, timeout);
    timeouts.push(i);
  };

  let t, kill = function() {
    while((t = timeouts.shift()))
      clearTimeout(t);
  };

  return function(stop) {
    if(stop !== undefined)
      return kill(), drain();

    opened = true;
    let task = guid();
    tasks.push(task);
    return close.bind(null, task);
  };
};

module.exports = keepAliveMgr;
