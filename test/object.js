"use strict";

var expect = require('expect.js')
var combine = require('../object/combine')




describe("object functions", function(){

    it("should test combine", function(){
        var keys = ["france", "italy", "usa"];
        var values=  ["baguette", "pizza", "hamburger"];
        expect(combine(keys, values)).to.eql({
          "france" : "baguette",
          "italy"  : "pizza",
          "usa"    : "hamburger",
        });
    });

    it("should return empty object", function(){
        var values=  ["baguette", "pizza", "hamburger"];
        expect(combine(null, values)).to.eql({});
    });


});
