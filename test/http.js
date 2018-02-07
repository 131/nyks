"use strict";

const expect = require('expect.js');

const url    = require('url');
const util   = require('util');
const fs     = require('fs');

const fetch       = require('../http/fetch');
const get         = require('../http/get');
const getContents = require('../http/getContents');
const request     = require('../http/request');

const pipe        = require('../stream/pipe');
const tmppath     = require('../fs/tmppath');

describe("Testing http", function() {

  var port;
  var http   = require('http');
  var server = http.createServer(function(req, resp) {
    if(req.url == "/ping")
      return resp.end("pong");

    resp.statusCode = 500;
    resp.end("bye");
  });

  it("should start a dummy http instance", function(done) {
    server.listen(function() {
      port = server.address().port;
      done();
    });
  });

  it("Should fetch dummy cotents", function(done) {
    var testurl = util.format("http://127.0.0.1:%d/ping", port);
    getContents(testurl, function(err, ip) {
      expect(err).not.to.be.ok();
      expect(("" + ip).trim()).to.be("pong");
      done();
    });
  });

  it("Should test fetch ", function(done) {
    var tmp_file = tmppath();
    var dest = fs.createWriteStream(tmp_file);
    var testurl = util.format("http://127.0.0.1:%d/ping", port);
    pipe(fetch(testurl), dest).then(function() {
      var body = fs.readFileSync(tmp_file, 'utf-8');
      expect(body).to.be("pong");
      done();
    });
  });

  it("Should fetch missing resource", function(done) {
    var testurl = util.format("http://127.0.0.1:%d/missing", port);
    getContents(testurl, function(err, body) {
      expect(err).to.be.ok();
      done();
    });
  });

  it("Should fetch dummy error", function(done) {
    var testurl = url.parse(util.format("https://127.0.0.1:%d/ping", port + 1));
    getContents(testurl, function(err, ip) {
      expect(err).to.be.ok();
      done();
    });
  });

});
