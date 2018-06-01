"use strict";

const expect = require('expect.js');

const pickIn  = require('../array/pickIn');
const reindex = require('../array/reindex');
const sum     = require('../array/sum');

describe("Array functions", function() {

  it("should test sum", function() {
    expect(sum([1, 2, 3, 4])).to.be(10);
  });

  it("should test sum of empty array", function() {
    expect(sum([])).to.be(0);
  });

  it("should test pickIn", function() {
    expect(pickIn('b', ['a', 'b', 'c', 'd'])).to.be('b');
  });

  it("should test pickIn with wrong value", function() {
    expect(pickIn('melon', ['a', 'b', 'c', 'd'])).to.be('a');
  });

  it("should test reindex", function() {
    var people = [
      {name : 'Jean Lebon',   age : 12, town : 'Paris'},
      {name : 'John TheGood', age : 22, town : 'Dallas'},
      {name : 'Juan ElBueno', age : 35, town : 'Madrid'},
    ];

    var target = {
      'Jean Lebon'   : {name : 'Jean Lebon',   age : 12, town : 'Paris'},
      'John TheGood' : {name : 'John TheGood', age : 22, town : 'Dallas'},
      'Juan ElBueno' : {name : 'Juan ElBueno', age : 35, town : 'Madrid'}
    };

    expect(reindex(people, 'name')).to.eql(target);
  });

});
