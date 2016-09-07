"use strict";

var expect = require('expect.js')
var co     = require('co');

var defer  = require('../promise/defer')


describe("Paths functions", function(){


    it("testing defer errors", function(done){
      co(function*(){
        var defered = defer();
        
        setTimeout(function(){
          defered.reject("Nope");
        }, 0);

        try {
          yield defered;
        } catch(err){
          expect(err).to.be("Nope");
          done();
        }
      })
    });


    it("testing defer chain", function(done){
      co(function*(){
        var defered = defer();
        
        setTimeout(function(){
          defered.chain("Nope");
        }, 0);

        try {
          
          yield defered;
        } catch(err){
          expect(err).to.be("Nope");
        }


        var defered = defer();
        
        setTimeout(function(){
          defered.chain(null, "Okay");
        }, 0);

        var result = yield defered;
        expect(result).to.be("Okay");


        done();


      })
    });




    it("testing defer sync behavior", function(done){
      co(function*(){
        var defered = defer();
        
        defered.reject("Nope");
        done();
      })
    });

    it("testing defer accept", function(done){
      co(function*(){
        var defered = defer();

        setTimeout(function(){
          defered.resolve("okay");
        }, 0);

        var result = yield defered;

        expect(result).to.eql("okay");
        done();
      });
    });




});
