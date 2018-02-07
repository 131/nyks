"use strict";

const expect =  require('expect.js');

const mask    = require('../collection/mask');
const reindex = require('../collection/reindex');

//I feel a little sorry for that
describe("collections functions", function() {

  it("should test mask", function() {
    var data = {
      "france" : "baguette",
      "italy"  : "pizza",
      "usa"    : "hamburger",
    };
    expect(mask(data,  "we ate %s in %s")).to.eql({
      "france" : "we ate baguette in france",
      "italy"  : "we ate pizza in italy",
      "usa"    : "we ate hamburger in usa",
    });
  });


  it("should advanced mask", function() {
    var data = {
      "france" : "baguette",
      "italy"  : "pizza",
      "usa"    : "hamburger",
    };
    expect(mask(data,  "we ate %s in %s", "food_%s")).to.eql({
      "food_france" : "we ate baguette in france",
      "food_italy"  : "we ate pizza in italy",
      "food_usa"    : "we ate hamburger in usa",
    });


    expect(mask(data,  null, "food_%s")).to.eql({
      "food_france" : "baguette",
      "food_italy"  : "pizza",
      "food_usa"    : "hamburger",
    });
  });

});
