"use strict";

const https = require('https');
const http  = require('http');
const url  = require('url');
const qs   = require('querystring');

const merge      = require('mout/object/merge');
const encode     = require('mout/queryString/encode');
const trim       = require('mout/string/trim');
const contains   = require('mout/array/contains');
const startsWith = require('mout/string/startsWith');

const mask       = require('nyks/object/mask');
const pluck      = require('mout/object/pluck');

const request = function(/*target, [data,], chain */ ){

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
    if(res.statusCode !== 200)
      return chain(`Invalid status code '${res.statusCode}' for '${req.path}'`);
    chain(null, res);
  });

  req.once('error', chain);
  if(data)
    req.write(data);
  req.end();
};


module.exports = request;
