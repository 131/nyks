"use strict";

const https  = require('https');
const http   = require('http');
const url    = require('url');
const qs     = require('querystring');

const pluck  = require('mout/object/pluck');
const encode = require('mout/queryString/encode');
const merge  = require('mout/object/merge');
const trim   = require('mout/string/trim');

const mask   = require('../object/mask');

module.exports = function(/*target, [data,], chain */) {

  var args   = [].slice.apply(arguments);
  var chain  = args.pop();
  var target = args.shift();
  var data   = args.shift() || null;
  var query  = typeof target == "string" ? url.parse(target) : target;

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

  var req = transport.request(query, function(res) {
    req.removeAllListeners('error');
    clearTimeout(ti);

    if(!(res.statusCode >= 200 && res.statusCode < 300)) {
      let message = `Invalid status code '${res.statusCode}' for '${req.path}'`;
      let error = new Error(message);
      error.err = message;
      error.res = res;
      return chain(error);
    }
    chain(null, res);
  });

  req.on('finish', function() {
    // query has been sent, now we can wait for timeout
    let msg = `http request timeout for ${url.format(query)}`;
    ti = setTimeout(req.emit.bind(req), timeout, 'error', msg);
  });

  req.once('error', chain);
  if(data && typeof data.pipe == "function") {
    data.on('error', chain);
    data.pipe(req);
    return;
  }

  if(data)
    req.write(data);

  req.end();
};
