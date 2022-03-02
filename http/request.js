"use strict";

const https  = require('https');
const http   = require('http');
const url    = require('url');
const qs     = require('querystring');

const pluck  = require('mout/object/pluck');
const encode = require('mout/queryString/encode');
const merge  = require('mout/object/merge');
const trim   = require('mout/string/trim');
const defer  = require('../promise/defer');

const mask   = require('../object/mask');

const request = function(target, data) {
  var query  = typeof target == "string" ? url.parse(target) : target;

  if(!query.method)
    query.method =  data ? 'POST' : 'GET';

  if(query.followRedirect && query.redirectLimit == undefined)
    query.redirectLimit = 10;


  //Cookie:X-APPLE-WEB-KB-ASPCOB8QBWQ1JVMLAKEOFWELBME="v=1:t=AQAAAABWzO-1XtFLiXxOmZG3SlR66fcav3ExgY4~";
  if(!query.headers)
    query.headers = {};

  if(query.jar) {
    var cookie = query.headers.cookie || "";
    cookie += ";" + mask(pluck(query.jar, "value"), '%s="%s"', "; ");
    query.headers.cookie = cookie;
  }

  if(query.qs) {
    var i      = query.path.indexOf('?');
    var params = {};

    if(i !== -1) {
      params = qs.parse(query.path.substr(i + 1));
      query.path = query.path.substr(i);
    }

    query.qs = merge(params, query.qs);
    query.path += "?" + qs.stringify(query.qs);
  }

  if(data && typeof data.pipe != "function" && !Buffer.isBuffer(data)) {
    if(typeof data != "string")
      data = query.json ? JSON.stringify(data) : trim(encode(data), "?");
    Object.assign(query.headers, {
      'content-length' : Buffer.byteLength(data),
    });
  }

  var transport = query.protocol == 'https:' ? https : http;

  let ti;
  let timeout = query.reqtimeout || 60 * 1000;

  var defered = defer();

  var req = transport.request(query, function(res) {
    clearTimeout(ti);

    if(query.expect && query.expect !== res.statusCode) {
      let message = `Invalid status code '${res.statusCode}' for '${req.path}'`;
      let error = new Error(message);
      error.err = message;
      error.res = res;
      return defered.reject(error);
    }

    if(query.followRedirect && res.statusCode == 302) {
      if(query.redirectLimit-- < 0)
        return defered.reject("Too many redirections");

      let {location} = res.headers;
      location = url.parse(url.resolve(url.format(query), location));
      location.followRedirect = query.followRedirect;
      location.redirectLimit = query.redirectLimit;
      return defered.resolve(request(location));
    }

    defered.resolve(res);
  });

  req.on('finish', function() {
    // query has been sent, now we can wait for timeout
    let msg = `http request timeout for ${url.format(query)}`;
    ti = setTimeout(defered.reject, timeout, msg);
  });

  req.once('error', defered.reject);
  if(data && typeof data.pipe == "function") {
    data.on('error', defered.reject);
    data.pipe(req);
  } else {
    if(data)
      req.write(data);
    req.end();
  }

  return defered;
};

module.exports = request;

