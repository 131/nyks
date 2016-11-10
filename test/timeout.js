"use strict";
const expect     = require('expect.js');
const timeout    = require('../generator/timeout');
const sleep      = require('../function/sleep');

describe("testing timeout", function() {
 
  it("should not change original function", function *(){
    var resolve = function*(a){
      yield sleep(100);
      return "done " + a;
    }

    var reject = function*(){
      yield sleep(100);
      throw "reject";
    }

    var Resolve = timeout(resolve, 300);
    var Reject  = timeout(reject, 300);
    var resolveWithoutTimeout = timeout(resolve);
   
    try{
      var rej = yield Reject();
    }catch(err){
      expect(err).to.eql("reject");
    }
    
    var res   = yield Resolve("cool");
    expect(res).to.eql("done cool");

    var res   = yield resolveWithoutTimeout("cool 2");
    expect(res).to.eql("done cool 2");
  });


  it("should not run with bad argument", function *(){
    var resolve = function*(a){
      yield sleep(100);
      return "done";
    }

    var Resolve = timeout(resolve, "aze");
   
    try{
      var rej = yield Resolve();
    }catch(err){
      expect(err).to.eql("timeout must be a number");
    }
  });


  it("should timout", function *(){
    var time = 100;
    
    var testTimout = function*(a){
      yield sleep(time);
      return "pass";
    }

    var passTimeout  = timeout(testTimout, time + 5);
    var crachTimeout = timeout(testTimout, time - 5);

    var data = yield passTimeout();
    expect(data).to.eql("pass");
    try{
      var data = yield crachTimeout();
    }catch(err){
      expect(err).to.eql("timeout");
    }
  });

});