"use strict";

var expect   = require('expect.js')
var passthru = require('../child_process/passthru')



describe("Child process functions", function(){

    it("should test passthru", function(chain){
        passthru("hostname", {}, function(err, exit){
          expect(exit).to.be(0);
          chain();
        });
    });

});
