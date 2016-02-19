"use strict";

var expect = require('expect.js')
var util   = require('util')
var url   = require('url')
var getContents   = require('../http/getContents')





describe("Testing http", function(){

  var http = require('http'), port;

  var server = http.createServer(function(req, resp){
    if(req.url == "/ping")
      return resp.end("pong");
    
    resp.statusCode = 500;
    resp.end("bye");
  });

  it("should start a dummy http instance", function(done){
    server.listen(function(){
      port = server.address().port;
      done();
    });
  });


  it("Should fetch dummy cotents", function(done){
    var testurl = util.format("http://127.0.0.1:%d/ping", port);
    getContents(testurl , function(err, ip){
      expect(err).not.to.be.ok();
      expect(ip.trim()).to.be("pong");
      done();
    });
  });

  it("Should fetch missing resource", function(done){
    var testurl = util.format("http://127.0.0.1:%d/missing", port);
    getContents(testurl , function(err, body){
      expect(err).to.be.ok();
      done();
    });
  });

  it("Should fetch dummy error", function(done){
    var testurl = url.parse(util.format("https://127.0.0.1:%d/ping", port + 1));
    getContents(testurl , function(err, ip){
      expect(err).to.be.ok();
      done();
    });
  });



});
