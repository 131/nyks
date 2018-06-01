"use strict";


const expect   =  require('expect.js');

const combine    = require('../object/combine');
const difference = require('../object/difference');
const indexOf    = require('../object/indexOf');
const jsonpath   = require('../object/jsonpath');
const mask       = require('../object/mask');
const sort       = require('../object/sort');

//I feel a little sorry for that
describe("object functions", function() {

  it("should test sort", function() {
    var keys = {
      "france" : "baguette",
      "italy"  : "pizza",
      "usa"    : "hamburger"
    };
    expect(sort(keys, ["france", "italy"])).to.eql({
      "france" : "baguette",
      "italy"  : "pizza"
    });
  });

  it("should test difference", function() {
    var obj1 = {a : 5, c : 2, d : "aa"};
    var obj2 = {b : 3, c : 2, d : "a"};

    expect(difference(obj1, obj2)).to.eql(["a", "b", "d"]);
  });



  it("should test indexOf", function() {
    var keys   = ["france", "italy", "usa"];
    var values = ["baguette", "pizza", "hamburger"];
    expect(indexOf(combine(keys, values), "pizza")).to.eql("italy");
    expect(indexOf(combine(keys, values), "melon")).to.eql(null);
  });

  it("should return empty object", function() {
    var values = ["baguette", "pizza", "hamburger"];
    expect(combine(null, values)).to.eql({});
  });


  it("should test mask", function() {
    var values = {
      "france" : "baguette",
      "italy"  : "pizza",
      "usa"    : "hamburger"
    };
    expect(mask(values, "In %s we eat %s", ". ")).to.eql("In france we eat baguette. In italy we eat pizza. In usa we eat hamburger");
  });


  it("should test jsonpath", function() {
    var values = {
      "france" : "baguette",
      "italy"  : {"food" : "pizza" },
      "usa"    : "hamburger"
    };

    expect(jsonpath(values, "/france")).to.be("baguette");
    expect(jsonpath(values, "/italy/food")).to.be("pizza");
    expect(jsonpath(values, "/italy/drink")).to.be(null);
  });

});
