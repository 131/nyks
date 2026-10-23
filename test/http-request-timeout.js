"use strict";

const assert = require('assert');
const http = require('http');
const url = require('url');
const {PassThrough} = require('stream');
const {spawnSync} = require('child_process');
const request = require('../http/request');
const drain = require('../stream/drain');

const sleep = (duration) => new Promise(resolve => setTimeout(resolve, duration));

// Track connections so each test verifies cancellation and releases its server.
describe('HTTP request timeout lifecycle', function() {
  this.timeout(5000);
  let server, target, sockets;

  beforeEach(async function() {
    sockets = new Set();
    server = http.createServer();
    server.on('connection', socket => {
      sockets.add(socket);
      socket.once('close', () => sockets.delete(socket));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    target = url.parse(`http://127.0.0.1:${server.address().port}/`);
  });

  afterEach(async function() {
    for(const socket of sockets)
      socket.destroy();
    await new Promise(resolve => server.close(resolve));
  });

  it('destroys a request whose response headers do not arrive', async function() {
    server.on('request', () => {});
    await assert.rejects(request({...target, reqtimeout : 40}), err => {
      assert.strictEqual(err.code, 'ETIMEDOUT');
      assert.match(err.message, /http request timeout/);
      return true;
    });
    await sleep(30);
    assert.strictEqual(sockets.size, 0);
  });

  it('keeps the deadline active while the response body is read', async function() {
    server.on('request', (req, res) => res.write('partial'));
    const res = await request({...target, reqtimeout : 60});
    await assert.rejects(drain(res), err => err.code === 'ETIMEDOUT');
    await sleep(30);
    assert.strictEqual(sockets.size, 0);
  });

  it('uses one deadline for headers and body', async function() {
    server.on('request', (req, res) => {
      setTimeout(() => {
        res.write('partial');
        setTimeout(() => res.end('done'), 90);
      }, 90);
    });
    const res = await request({...target, reqtimeout : 150});
    await assert.rejects(drain(res), err => err.code === 'ETIMEDOUT');
  });

  it('clears the deadline after a complete response', async function() {
    server.on('request', (req, res) => res.end('complete'));
    const res = await request({...target, reqtimeout : 50});
    let failure;
    res.on('error', err => { failure = err; });
    assert.strictEqual(String(await drain(res)), 'complete');
    await sleep(90);
    assert.strictEqual(failure, undefined);
  });

  it('retains a readable response when expect rejects the status', async function() {
    server.on('request', (req, res) => {
      res.writeHead(403);
      res.end('denied');
    });
    try {
      await request({...target, expect : 200, reqtimeout : 80});
      assert.fail('Expected a status rejection');
    } catch(err) {
      assert.strictEqual(err.res.statusCode, 403);
      assert.strictEqual(String(await drain(err.res)), 'denied');
    }
  });

  it('bounds the response body attached to an unexpected status', async function() {
    server.on('request', (req, res) => {
      res.writeHead(403);
      res.write('partial');
    });
    try {
      await request({...target, expect : 200, reqtimeout : 60});
      assert.fail('Expected a status rejection');
    } catch(err) {
      assert.strictEqual(err.res.statusCode, 403);
      await assert.rejects(drain(err.res), failure => failure.code === 'ETIMEDOUT');
    }
  });

  it('closes the HTTP request when an upload stream fails', async function() {
    server.on('request', () => {});
    const input = new PassThrough();
    const pending = request({...target, method : 'POST', reqtimeout : 1000}, input);
    input.write('partial');
    await sleep(20);
    const failure = new Error('upload failed');
    input.destroy(failure);
    await assert.rejects(pending, err => err === failure);
    await sleep(30);
    assert.strictEqual(sockets.size, 0);
  });

  it('carries the configured timeout into a followed redirect', async function() {
    let stalled;
    server.on('request', (req, res) => {
      if(req.url === '/') {
        res.writeHead(302, {location : '/stall'});
        res.end('redirect');
      } else {
        stalled = req.socket;
      }
    });
    await assert.rejects(request({...target, followRedirect : true, reqtimeout : 50}), err => err.code === 'ETIMEDOUT');
    await sleep(30);
    assert.strictEqual(stalled.destroyed, true);
  });

  it('transfers an upgraded socket to its caller', async function() {
    server.on('upgrade', (req, socket) => {
      socket.write('HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: test\r\n\r\n');
    });
    const result = await request({...target, reqtimeout : 40, headers : {Connection : 'Upgrade', Upgrade : 'test'}});
    await sleep(80);
    assert.strictEqual(result.socket.destroyed, false);
    result.socket.destroy();
  });

  it('cleans a failed connection timer so a process can exit immediately', function() {
    const script = `const http = require('http');
      const request = require(${JSON.stringify(require.resolve('../http/request'))});
      const server = http.createServer();
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        server.close(async () => {
          try { await request({hostname:'127.0.0.1', port, path:'/', reqtimeout:10000}); process.exitCode=2; }
          catch(err) { if(err.code !== 'ECONNREFUSED') process.exitCode=3; }
        });
      });`;
    const child = spawnSync(process.execPath, ['-e', script], {timeout : 2000, encoding : 'utf8'});
    assert.ifError(child.error);
    assert.strictEqual(child.status, 0, child.stderr);
  });
});
