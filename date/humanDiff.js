"use strict";

const sprintf = require('../string/sprintf');

const FORMAT_LIGHT = 'FORMAT_LIGHT';
const FORMAT_FULL  = 'FORMAT_FULL';

const FORMATS = {
  [FORMAT_FULL] : {
    '%d s'       : 60,
    '%d min%s'   : 60,
    '%d hour%s'  : 24,
    '%d day%s'   : 30,
    '%d month%s' : 12,
    '%d year%s'  : 0,
  },
  [FORMAT_LIGHT] : {
    '%ds'       : 60,
    '%dm'       : 60,
    '%dh'       : 24,
    '%dd'       : 30,
    '%dmonth%s' : 12,
    '%dy'       : 0,
  }
};

module.exports = function(timestamp, max = 2, format = FORMAT_LIGHT) {
  let steps = FORMATS[format];
  let name = Object.keys(steps)[0];
  let out = {};
  timestamp = Math.ceil(timestamp);
  if(!timestamp)
    return sprintf(name, 0);


  let current;
  for(name in steps) {
    let step_time = steps[name];
    if(step_time == 0) {
      current = Math.floor(timestamp);
    } else {
      current = Math.floor(timestamp % step_time);
      timestamp /= step_time;
    }
    if(current > 0)
      out[name] = sprintf(name, current, current > 1 ? 's' : '');
  }
  let keys = Object.keys(out).reverse().slice(0, max);
  return keys.map(k => out[k]).join(' ');
};

