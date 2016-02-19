"use strict";

var expect = require('expect.js')


Math.log10 = null; //force alternative for testing


var nyks   = require('../');




describe("Global nyks include", function(){

    it("Should provide love", function(){
        expect(nyks).to.be.ok();
    });


});
