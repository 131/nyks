"use strict";
const expect = require('expect.js');

const func = require('../generator/func');
const setImmediate = require('async-co/setImmediate');
const range      = require('mout/array/range');
const eachLimit = require('async-co/eachLimit');

describe("testing generator", function() {

    class Foo {
      constructor(start) {
        this.tick = start;
      }
      * walk (step) {
        yield new Promise(setImmediate);
        this.tick += step || 1;
        return this.tick;
      }
    }

  it("should test generator func", function *(){
    var foos = range(1,10).map( i => new Foo(i) );
    var ticks = yield eachLimit(foos, 2, func('walk'));
    expect(ticks).to.eql([2,3,4,5,6,7,8,9,10,11]);
  });


  it("should handle test generator func curry", function *(){
    var foos = range(1,10).map( i => new Foo(i) );
    var ticks = yield eachLimit(foos, 2, func('walk', 2));
    expect(ticks).to.eql([3,4,5,6,7,8,9,10,11, 12]);
  });







});