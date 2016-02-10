"use strict";

var http      = require('http');
var https     = require('https');
var url       = require('url');

var startsWith = require('mout/string/startsWith');

var get = module.exports = function(requrl, chain) {
  if(typeof requrl == "string")
      requrl = url.parse(requrl);
  return requrl.protocol ==  "https:" ? https.get.apply(this, arguments) : http.get.apply(this, arguments);
}

