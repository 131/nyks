"use strict";

/* global it describe */

const expect = require('expect.js');

const throttle = require('../../async/throttle');

const each         = require('../../async/each');
const setImmediate = require('../../async/setImmediate');

const range  = require('mout/array/range');

describe('throttle', function() {

  it('basics', async function() {
    var current = 0;
    //begin async walker
    var walk    = function () {
      current++;
      if(current >= 20)
        return;
      setImmediate(walk);
    };

    var q = throttle(async function () {
      if(current == 0)
        walk();
      await new Promise(setImmediate);
      return current;
    }, 2);

    var result = await each(range(1, 10), q);

    expect(result).to.eql([2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  });

});

