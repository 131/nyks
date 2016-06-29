"use strict";

var expect = require('expect.js');
var once   = require('../function/once');
var detach = require('../function/detach');
var unary  = require('../function/unary');
var promisify  = require('../function/promisify');


describe("Testing functions helpers", function(){

    it("should test once", function(){


        var a = 0, f  = function(){ return (a+= 1); }, g = once(f);

        f(); f();
        expect(a).to.be(2);
        g(); g();
        expect(a).to.be(3);
        expect(g()).to.be(3);


    });

    it("should test unary", function(){

        var f = function(){ return arguments.length },
            g = unary(f);

        expect(f(1,2)).to.be(2);
        expect(g(1,2)).to.be(1);

    });



    it("should test detach", function(chain){
        var a = 0, b = 0 , c = function(i){ b+= i; }, d = detach(c);
        var foo = detach();
        foo(); // this is useless..., but do not crash


        c(1);
        expect(b).to.be(1);

        d(2);
        expect(b).to.be(1);


        setTimeout(function(){
          expect(b).to.be(3);
          chain();
        }, 100);
    });
    
    it("should test promisify with no err", function(done){
      var sayHello = function(str, err, cb) {
        setTimeout(function(){
          cb(err, "Hello " + str)
        })
      };

      var sayHi = function(cb) { //bind that
        var self = this;
        setTimeout(function(){
          cb(null, "Hi" + self.name)
        })
      };
      
      var fn = promisify(sayHello);
      fn("world" , null)
      .catch(function(err){
        expect(false).to.be(true);
      })
      .then(function(val) {
        expect(val).to.be.equal("Hello world");
        fn("world" , "error")
        .catch(function(err){
          expect(err).to.be("error");
          done();
        })
        .then(function(val) {
          expect(false).to.be.equal(true);
        })
      });


      var fne = promisify(sayHi, {name:"Joe"});
      fne()
      .then(function(val) {
        expect(val).to.be.equal("Hi Joe");
        done();
      })
    });
    



});



