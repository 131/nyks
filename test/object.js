"use strict";

var expect =  require('expect.js')
var combine  = require('../object/combine')
var mask     = require('../object/mask')
var jsonpath = require('../object/jsonpath')


//i feel a little sorry for that


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


    it("should test mask", function(){
        var values=  {
          "france" : "baguette",
          "italy"  : "pizza",
          "usa"    : "hamburger",
        };

        expect(mask(values,  "In %s we eat %s", ". ")).to.eql("In france we eat baguette. In italy we eat pizza. In usa we eat hamburger");
    });


    it("should test jsonpath", function(){
        var values=  {
          "france" : "baguette",
          "italy"  : { "food" : "pizza" },
          "usa"    : "hamburger",
        };

        expect(jsonpath(values, "/france")).to.be("baguette");
        expect(jsonpath(values, "/italy/food")).to.be("pizza");
        expect(jsonpath(values, "/italy/drink")).to.be(null);
    });

});
