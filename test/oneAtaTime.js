"use strict";
const expect     = require('expect.js');
const oneAtaTime = require('../generator/oneAtATime');
const sleep      = require('../function/sleep');

describe("testing one at a time", function() {
 
  it("should not change original function", function *(){

    var resolve = function*(a){
      yield sleep(200);
      return "done " + a;
    }

    var reject = function*(){
      yield sleep(200);
      throw "reject";
    }

    var oneAtATImeResolve = oneAtaTime(resolve);
    var oneAtATImeReject  = oneAtaTime(reject);
   
    try{
      var rej = yield oneAtATImeReject();
    }catch(err){
      expect(err).to.eql("reject");
    }
    
    var res   = yield oneAtATImeResolve("cool");
    expect(res).to.eql("done cool");
  });


  it("should emmit error if run simultaneously", function *(){
    var a = 0;
    var wait200 = function*(){
      a = a + 1 ;
      yield sleep(200);
      return "done";
    }

    var runOneAtATIme = oneAtaTime(wait200);
    var res = yield runOneAtATIme();
    expect(res).to.eql("done");
    expect(a).to.eql(1);
    yield runOneAtATIme();
    expect(a).to.eql(2);
    try{
      var res = yield [runOneAtATIme , runOneAtATIme, runOneAtATIme];
    }catch(err){
      expect(err).to.eql("ALLREADY RUNNING");
    }
    expect(a).to.eql(3);
    yield sleep(201);
    yield runOneAtATIme();
    expect(a).to.eql(4);
  });



});