"use strict";

const once = require('../function/once');
const get  = require('./get');

module.exports = function(source, chain) {
  var body = [];
  chain = once(chain);

  var req = get(source, function(resp) {
    if(resp.statusCode != 200)
      return chain("Bad status code");

    resp.on('error', chain);
    resp.on('data', function(data) {
      body.push(data);
    });

    resp.on('end', function() {
      chain(null, Buffer.concat(body));
    });

  });

  req.on('error', chain);
};
