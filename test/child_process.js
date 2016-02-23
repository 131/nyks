"use strict";

var expect   = require('expect.js')
var passthru = require('../child_process/passthru')
var exec     = require('../child_process/exec')
var os       = require('os');


describe("Child process functions", function(){

    it("should test passthru", function(chain){
        passthru("hostname", {}, function(err, exit){
          expect(exit).to.be(0);
          chain();
        });
    });


    it("should test exec", function(chain){
        exec("hostname", {}, function(err, body){
          expect(err).not.to.be.ok();
          expect(body.trim()).to.be(os.hostname());
          chain();
        });
    });


});
