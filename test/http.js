"use strict";


const expect = require('expect.js');

const url    = require('url');
const querystring = require('querystring');
const util   = require('util');
const fs     = require('fs');
const {PassThrough} = require('stream');

const fetch       = require('../http/fetch');

const request     = require('../http/request');

const drain       = require('../stream/drain');
const tmppath     = require('../fs/tmppath');
const md5         = require('../crypto/md5');

const HTTP_CODE_ERRR = 500;

describe("Testing http", function() {

  var getHashParams = function(base) {

    var hashParams = {};
    var e;
    var a = /\+/g;  // Regex for replacing addition symbol with a space
    var r = /([^&;=]+)=?([^&;]*)/g;
    var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
    var q = base;

    while((e = r.exec(q)))
      hashParams[d(e[1])] = d(e[2]);

    return hashParams;
  };

  var port;
  var entrypoint;

  var http   = require('http');
  var server = http.createServer(async function(req, resp) {
    let current_url = url.parse(req.url);
    let hash        = current_url.query ? getHashParams(current_url.query) : {};

    if(current_url.pathname == "/ping")
      return resp.end("pong");


    if(current_url.pathname == "/reloc/front") {
      resp.statusCode = 302;
      resp.setHeader('location', '/ping');
      return resp.end();
    }

    if(current_url.pathname == "/reloc/infinity") {
      resp.statusCode = 302;
      resp.setHeader('location', '/reloc/infinity');
      return resp.end();
    }

    if(current_url.pathname == "/request")
      return resp.end(JSON.stringify(hash));

    if(current_url.pathname == "/show_cookies")
      return resp.end(req.headers.cookie);

    if(current_url.pathname == '/throwme') {
      resp.statusCode = HTTP_CODE_ERRR;
      return resp.end('Nop');
    }

    if(current_url.pathname == "/timeout") {
      setTimeout(function() {
        resp.end('pong');
      }, 1.8 * 1000);

      return;
    }

    if(current_url.pathname == '/md5') {
      let payload = await drain(req);
      return resp.end(md5(payload));
    }

    if(current_url.pathname == '/stream') {
      let result = '' + (await drain(req));
      return resp.end(result);
    }

    resp.end();
  });

  it("should start a dummy http instance", async () => {
    port = await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', function() {
        resolve(server.address().port);
      });
    });
    console.log("Got testing server listening on %d", port);
    entrypoint = util.format("http://127.0.0.1:%d", port);
  });


  it("Should test fetch ", async () => {
    var testurl = `${entrypoint}/ping`;
    let body = String(await drain(fetch(testurl)));
    expect(body).to.be("pong");
  });

  it("Should test fetch with failed timeout", async () => {
    var testurl = `${entrypoint}/timeout`;
    try {
      await fetch(testurl, {timeout : 200});
    } catch(err) {
      expect(err).to.match(/Timeout in http fetch/);
    }
  });

  it("Should test fetch with sufficient timeout", async () => {
    var testurl = `${entrypoint}/timeout`;
    let res = await fetch(testurl, {timeout : 2000});
    expect(res.statusCode).to.be(200);
  });






  it("Should test fetch on https endpoint and fail",  async () => {
    var testurl = util.format("https://127.0.0.1:%d/ping", port);
    try {
      await fetch(url.parse(testurl));
      expect().fail("Never here");
    } catch(err) {
      expect(err).not.to.be("Never here");
    }
  });


  it("Should NOT follow redirect by default", async () => {
    var testurl = `${entrypoint}/reloc/front`;
    let res = await request(testurl);
    expect(res.statusCode).to.be(302);
  });

  it("Should follow redirect, when asked", async () => {
    var testurl = `${entrypoint}/reloc/front`;
    let res = await request({...url.parse(testurl), followRedirect : true});
    expect(res.statusCode).to.be(200);
    expect(String(await drain(res))).to.be("pong");
  });


  it("Should crash on unlimited redirection", async () => {
    var testurl = `${entrypoint}/reloc/infinity`;

    try {
      await request({...url.parse(testurl), followRedirect : true});
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.match(/Too many redirections/);
    }
  });

  it("Should test request with target as string", async () => {
    var target = `${entrypoint}/ping`;

    //this is for coverage, used to force POST method from a String URL
    let data = {
      name : 'Jean Lebon'
    };

    let res = await request(target, data);
    let body = String(await drain(res));
    expect(body).to.be("pong");
  });

  it("Should test request with a buffer payload", async () => {
    var testurl = `${entrypoint}/md5`;
    let payload = Buffer.from("this is foo de bar");

    let res = await request({...url.parse(testurl), method : 'PUT'}, payload);
    let body = String(await drain(res));
    expect(body).to.eql(md5(payload));
  });



  it("Should test request with target as Url", async () => {
    var target = `${entrypoint}/ping`;

    let res = await request(target);
    let body = String(await drain(res));
    expect(body).to.be("pong");
  });

  it("Should test request with GET args", async () => {
    var target = `${entrypoint}/request?get_var=melon`;

    let res = await request(target);
    let body = JSON.parse(await drain(res));
    expect(body).to.eql({get_var : 'melon'});
  });

  it("Should test jar header", async () => {
    var target = url.parse(`${entrypoint}/show_cookies`);

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

    let res = await request(target);
    let body = String(await drain(res));
    expect(body).to.be(expected_full);
  });

  it("Should test request with forced Headers & Method", async () => {
    var target = url.parse(`${entrypoint}/ping`);

    target.headers = {};
    target.method  = 'GET';

    let res = await request(target);
    let body = String(await drain(res));
    expect(body).to.be("pong");
  });

  it("Should test request with Query String flag on", async () => {
    var target = url.parse(`${entrypoint}/request`);

    var expected = {
      firstname : 'Jean'
    };

    target.qs = expected;

    let res = await request(target);
    let body = JSON.parse(await drain(res));
    expect(body).to.eql(expected);
  });

  it("Should test request with search", async () => {
    var target = url.parse(`${entrypoint}/request`);

    var expected = {
      firstname : 'Jean'
    };

    target.search = '?' + querystring.stringify(expected);

    let res = await request(target);
    let body = JSON.parse(await drain(res));
    expect(body).to.eql(expected);
  });

  it("Should test request with Query String AND QUERY STRING (and it should explode)", async () => {
    var target = url.parse(`${entrypoint}/request?lastname=Lebon`);

    var expected = {
      firstname : 'Jean'
    };
    target.qs = expected;

    try {
      await request(target);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).not.to.be("Never here");
    }
  });

  it("Should test request and throw", async () => {
    var target = url.parse(`${entrypoint}/throwme`);
    var res = await request(target);
    expect(res.statusCode).to.eql(HTTP_CODE_ERRR);
    let body = String(await drain(res));
    expect(body).to.be('Nop');

  });

  it("Should test request and throw with expect", async () => {
    var target = url.parse(`${entrypoint}/throwme`);

    try {
      await request({...target, expect : 200});
      expect().to.fail("Never here");
    } catch(err) {
      expect(err.err).to.be(`Invalid status code '${HTTP_CODE_ERRR}' for '/throwme'`);
      let body = String(await drain(err.res));
      expect(body).to.be('Nop');
    }
  });





  this.timeout(60 * 1000);

  it("Should test request with a timeout", async () => {
    var target = url.parse(`${entrypoint}/timeout`);

    let input = new PassThrough();
    setTimeout(function() {
      input.end("foo de bar");
    }, 1800);


    try {
      await request({...target, reqtimeout : 200}, input);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.match(/http request timeout/);
    }

    let res = await request(target, input);
    expect(res.statusCode).to.eql(200);
  });

  it("Should test request with failed a timeout", async () => {
    var target = url.parse(`${entrypoint}/timeout`);

    let input = new PassThrough();
    setTimeout(function() {
      input.end("foo de bar");
    }, 1800);

    let res = await request({...target, reqtimeout : 2000}, input);
    expect(res.statusCode).to.eql(200);
  });



  it("Should test request with data as Stream", async () => {
    var target        = url.parse(`${entrypoint}/stream`);
    var file_content = "dummy";
    var tmp_file     = tmppath();

    fs.writeFileSync(tmp_file, file_content);

    var dest = fs.createReadStream(tmp_file);

    let res = await request(target, dest);
    let body = String(await drain(res));
    expect(body).to.be(file_content);
    fs.unlinkSync(tmp_file);
  });

  it("Should test request with json flag On", async () => {
    var target = url.parse(`${entrypoint}/stream`);

    target.json = true;

    let data = {
      name : 'Juan Elbueno'
    };

    let res = await request(target, data);
    let body = JSON.parse(await drain(res));
    expect(body).to.eql(data);
  });

  it("Should test request with data as string", async () => {
    var target        = url.parse(`${entrypoint}/stream`);
    let data = "name='Juan Elbueno'";

    let res = await request(target, data);
    let body = String(await drain(res));
    expect(body).to.be(data);
  });

  it("Should test request on https endpoint and fail",  async () => {
    var testurl = url.format(`${entrypoint}/ping`);

    try {
      await request(url.parse(testurl));
      expect().fail("Never here");
    } catch(err) {
      expect(err).not.to.be("Never here");
    }
  });


});
