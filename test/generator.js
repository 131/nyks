"use strict";
const expect = require('expect.js');

const func = require('../generator/func');
const setImmediate = require('async-co/setImmediate');
const range      = require('mout/array/range');
const eachLimit = require('async-co/eachLimit');

describe("testing generator", function() {

  it("should test generator func", function *(){


    class Foo {
      constructor(start) {
        this.tick = start;
      }
      * walk () {
        yield new Promise(setImmediate);
        this.tick ++;
        return this.tick;
      }
    }


    var foos = range(1,10).map( i => new Foo(i) );
    var ticks = yield eachLimit(foos, 2, func('walk'));
    expect(ticks).to.eql([2,3,4,5,6,7,8,9,10,11]);
  });







});