"use strict";
var https = require('https');
var http  = require('http');
var url  = require('url');
var qs   = require('querystring');

var merge      = require('mout/object/merge');
var encode     = require('mout/queryString/encode');
var trim       = require('mout/string/trim');
var contains   = require('mout/array/contains');
var startsWith = require('mout/string/startsWith');

var mask       = require('nyks/object/mask');
var pluck      = require('mout/object/pluck');

var request = function(/*target, [data,], chain */ ){

  var args  = [].slice.apply(arguments),
      chain  = args.pop(),
      target = args.shift(),
      data   = args.shift() || null;

  var query = typeof target == "string" ? url.parse(target) : target;

  if(!query.method)
      query.method =  data ? 'POST' : 'GET';

  //Cookie:X-APPLE-WEB-KB-ASPCOB8QBWQ1JVMLAKEOFWELBME="v=1:t=AQAAAABWzO-1XtFLiXxOmZG3SlR66fcav3ExgY4~";
  if(!query.headers)
    query.headers = {};

  if(query.jar) {
    var cookie = query.headers.cookie || "";
    cookie += ";" + mask(pluck(query.jar, "value"), '%s="%s"', "; ");
    query.headers.cookie = cookie;
  }

  if(data && typeof data != "string")
    data = query.json ? JSON.stringify(data) : trim(encode(data), "?");



  if(query.qs) {
    var i = query.path.indexOf('?'), params = {};
    if(i !== -1) {
      params = qs.parse(query.path.substr(i+1));
      query.path = substr(i);
    }

    query.qs = merge(params, query.qs);
    query.path += "?" + qs.stringify(query.qs);
  }

  if(data) merge(query, {
      'content-length' : Buffer.byteLength(data),
  });


  var transport = query.protocol == 'https:' ? https : http;


  var req = transport.request(query, function(res){
    var shouldBuffer = query.json || startsWith(res.headers["content-type"], "application/json");

    if(!shouldBuffer)
      return chain(null, res);

    var out = [];
    res.on("data", function(buf){ out.push(buf); });
    res.on("end", function(){
      var response = Buffer.concat(out);

      if(startsWith(res.headers["content-type"], "application/json"))
        response = JSON.parse(response);

      chain(null, response, res);
    });
  });
  if(data)
    req.write(data);
  req.end();
};


module.exports = request;