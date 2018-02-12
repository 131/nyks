"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const url    = require('url');
const util   = require('util');
const fs     = require('fs');

const fetch       = require('../http/fetch');
const getContents = require('../http/getContents');
const request     = require('../http/request');

const pipe        = require('../stream/pipe');
const drain       = require('../stream/drain');
const tmppath     = require('../fs/tmppath');

describe("Testing http", function() {

  var getHashParams = function(base) {

    var hashParams = {};
    var e;
    var a = /\+/g;  // Regex for replacing addition symbol with a space
    var r = /([^&;=]+)=?([^&;]*)/g;
    var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
    var q = base;

    while ((e = r.exec(q))) {
      hashParams[d(e[1])] = d(e[2]);
    }
    return hashParams;
  };

  var port;
  var http   = require('http');
  var server = http.createServer(async function(req, resp) {
    let current_url = url.parse(req.url);
    let hash        = current_url.query ? getHashParams(current_url.query) : {};

    if(current_url.pathname == "/ping")
      return resp.end("pong");

    if (current_url.pathname == "/request")
      return resp.end(JSON.stringify(hash));

    if (current_url.pathname == "/show_cookies")
      return resp.end(req.headers.cookie);

    if (current_url.pathname == '/throwme') {
      resp.statusCode = 500;
      resp.end('Nop');
    }
    if (current_url.pathname == '/stream') {
      let result = '' + (await drain(req));
      resp.end(result);
      return;
    }

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
    getContents(testurl, function(err) {
      expect(err).to.be.ok();
      done();
    });
  });

  it("Should fetch dummy error", function(done) {
    var testurl = url.parse(util.format("https://127.0.0.1:%d/ping", port + 1));
    getContents(testurl, function(err) {
      expect(err).to.be.ok();
      done();
    });
  });

  it("Should test request with target as string", function(done) {
    var target = util.format("http://127.0.0.1:%d/ping", port);

    //this is for coverage, used to force POST method from a String URL
    let data = {
      name : 'Jean Lebon'
    };

    request(target, data, async function(err, data) {
      expect(err).to.be(null);

      var body = '' + (await drain(data));
      expect(body).to.be("pong");

      done();
    });
  });

  it("Should test request with target as Url", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/ping", port));

    request(target, async function(err, data) {
      expect(err).to.be(null);

      var body = '' + (await drain(data));
      expect(body).to.be("pong");
      done();
    });
  });

  it("Should test request with GET args", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/request?get_var=melon", port));

    request(target, async function(err, data) {
      expect(err).to.be(null);

      var body = JSON.parse(await drain(data));
      expect(body).to.eql({get_var : 'melon'});
      done();
    });
  });

  it("Should test jar header", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/show_cookies", port));

    var key_1         = 'first';
    var key_2         = 'second';
    var expected_1    = 'Jean=Lebon';
    var expected_2    = 'Juan=Elbueno';
    var expected_full = `;${key_1}="${expected_1}"; ${key_2}="${expected_2}"`;

    target.jar = {
      [key_1] : {
        value : expected_1,
        date  : Date.now()
      },
      [key_2] : {
        value : expected_2,
        date  : Date.now()
      }
    };

    request(target, async function(err, data) {
      expect(err).to.be(null);

      var body = '' + (await drain(data));
      expect(body).to.be(expected_full);
      done();
    });
  });

  it("Should test request with forced Headers & Method", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/ping", port));

    target.headers = {};
    target.method  = 'GET';

    request(target, async function(err, data) {
      expect(err).to.be(null);

      var body = '' + (await drain(data));
      expect(body).to.be("pong");
      done();
    });
  });

  it("Should test request with Query String flag on", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/request", port));

    var expected = {
      firstname : 'Jean'
    };

    target.qs = expected;

    request(target, async function(err, data) {
      expect(err).to.be(null);

      var body = JSON.parse(await drain(data));
      expect(body).to.eql(expected);
      done();
    });
  });

  it("Should test request with Query String AND QUERY STRING (and it should explode)", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/request?lastname=Lebon", port));

    var expected = {
      firstname : 'Jean'
    };

    target.qs = expected;

    request(target, async function(err/*, data*/) {
      expect(err).to.be.ok();
      done();
    });
  });

  it("Should test request and throw", function(done) {
    var throw_path = '/throwme';
    var code       = 500;

    var target = url.parse(util.format("http://127.0.0.1:%d%s", port, throw_path));

    request(target, async function(err) {
      expect(err.err).to.be(`Invalid status code '${code}' for '${throw_path}'`);

      var body = '' + (await drain(err.res));
      expect(body).to.be('Nop');
      done();
    });
  });

  it("Should test request with data as Stream", function(done) {
    var target       = url.parse(util.format("http://127.0.0.1:%d/stream", port));
    var file_content = "dummy";
    var tmp_file     = tmppath();

    fs.writeFileSync(tmp_file, file_content);

    var dest = fs.createReadStream(tmp_file);

    request(target, dest, async function(err, data) {
      expect(err).to.be(null);

      var body = '' + (await drain(data));
      expect(body).to.be(file_content);
      fs.unlinkSync(tmp_file);
      done();
    });

  });

  it("Should test request with json flag On", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/stream", port));

    target.json = true;

    let data = {
      name : 'Juan Elbueno'
    };

    request(target, data, async function(err, resp) {
      expect(err).to.be(null);

      var body = JSON.parse(await drain(resp));
      expect(body).to.eql(data);
      done();
    });
  });

  it("Should test request with data as string", function(done) {
    var target = url.parse(util.format("http://127.0.0.1:%d/stream", port));

    let data = "name='Juan Elbueno'";

    request(target, data, async function(err, resp) {
      expect(err).to.be(null);

      var body = '' + await drain(resp);
      expect(body).to.be(data);
      done();
    });
  });

  it("Should test request with https endpoint", function(done) {
    var target = url.parse(util.format("https://127.0.0.1:%d/ping", port));

    request(target, async function(err) {
      expect(err).to.be.ok();
      // server shouldn't work with https endpoint, but request still answer socket error.
      done();
    });
  });

});
