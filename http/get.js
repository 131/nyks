"use strict";

const http  = require('http');
const https = require('https');
const url   = require('url');

module.exports = function(requrl/*, chain*/) {
  if(typeof requrl == "string")
    requrl = url.parse(requrl);
  return requrl.protocol ==  "https:" ? https.get.apply(this, arguments) : http.get.apply(this, arguments);
};
