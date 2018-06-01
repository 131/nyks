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

  it("should test reindex with Array", function() {
    var array_source = [
      {name : 'Jean Lebon',   age : 12, town : 'Paris'},
      {name : 'John TheGood', age : 22, town : 'Dallas'},
      {name : 'Juan ElBueno', age : 35, town : 'Madrid'},
    ];

    var array_target = {
      'Jean Lebon'   : {name : 'Jean Lebon',   age : 12, town : 'Paris'},
      'John TheGood' : {name : 'John TheGood', age : 22, town : 'Dallas'},
      'Juan ElBueno' : {name : 'Juan ElBueno', age : 35, town : 'Madrid'}
    };

    expect(reindex(array_source, 'name')).to.eql(array_target);
  });

  it("should test reindex with Object", function() {
    var object_source = {
      'Jean Lebon'   : {name : 'Jean Lebon',   age : 12, town : 'Paris'},
      'John TheGood' : {name : 'John TheGood', age : 22, town : 'Dallas'},
      'Juan ElBueno' : {name : 'Juan ElBueno', age : 35, town : 'Madrid'}
    };

    var object_target = {
      '12' : {name : 'Jean Lebon',   age : 12, town : 'Paris'},
      '22' : {name : 'John TheGood', age : 22, town : 'Dallas'},
      '35' : {name : 'Juan ElBueno', age : 35, town : 'Madrid'}
    };

    var small_object_target = {
      '12' : 'Paris',
      '22' : 'Dallas',
      '35' : 'Madrid'
    };

    expect(reindex(object_source, 'age')).to.eql(object_target);

    // now with one column
    expect(reindex(object_source, 'age', 'town')).to.eql(small_object_target);
  });

});
