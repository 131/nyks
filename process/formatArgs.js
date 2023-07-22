"use strict";


const sprintf   = require('util').format;
const forIn     = require('mout/object/forIn');
const isArray   = require('mout/lang/isArray');
const compact   = require('mout/array/compact');
const formatArg = require('./formatArg');

var fmt = (unix, k, v) => {
  if(v == undefined || v == null)
    return [];
  if(typeof v == "boolean" && v)
    return [sprintf("--%s", k)];
  v = formatArg(String(v));
  return unix ? [sprintf("--%s", k), v] : [sprintf("--%s=%s", k, v)];
};

module.exports = function(args, unix) {
  var cmds = [];
  forIn(args || {}, function (value, name) {
    var cmd = [];
    if(isArray(value))
      value.forEach(value => cmd.push.apply(cmd, fmt(unix, name, value)));
    else
      cmd = fmt(unix, name, value);
    cmds = cmds.concat(cmd);
  });
  cmds = compact(cmds);
  return cmds;
};

