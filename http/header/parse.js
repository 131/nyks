
"use strict";

const forOwn = require('mout/object/forOwn');
const split = new RegExp("\\s*(.+?)(?:=\\s*(?:\"([^\"]*)\"|'([^']*)'|(.*?)))?\\s*(;|,|$)", "g");

var parse = function(str) {
  var res;
  var out = {};
  while((res = split.exec(str)))
    out[res[1]] = res[2] || res[3] || res[4] || null;

  return out;
};

parse.parse_cookie = function(str) {
  var raw    = parse(str);
  var name   = Object.keys(raw)[0];
  var cookie = {value : raw[name], name : name, extras : {}};

  delete raw[name];

  forOwn(raw, function(v, k) { cookie.extras[k.toLowerCase()] = v; });

  return cookie;
};

module.exports = parse;

