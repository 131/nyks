"use strict";

const net = require('net');

const range     = require('mout/array/range');
const shuffle   = require('mout/array/shuffle');


function getPort(ports = 1025, maxPort = 65535, host = '127.0.0.1') {

  if(!Array.isArray(ports))
    ports = shuffle(range(parseInt(ports), parseInt(maxPort)));

  let port = ports.shift();
  if(port === undefined)
    return Promise.reject(`No available port`);

  let server = net.createServer();

  return new Promise((resolve) => {
    server.once('error', () => resolve(getPort(ports, undefined, host)));
    server.once('listening', function() {
      port = server.address().port;
      server.close(() => resolve(port));
    });
    server.listen(port, host);
  });
}


module.exports = getPort;
