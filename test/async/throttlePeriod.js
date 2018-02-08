"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const throttlePeriod = require('../../async/throttlePeriod');

const each  = require('../../async/each');

const range = require('mout/array/range');

describe('throttlePeriod', function() {

  this.timeout(10 * 1000);
  it('basics', async function() {

    var results    = {};
    var a          = 0;
    var b          = 0;
    var fn         = async function (c) {
      results[a++] = c;
    };
    var p          = throttlePeriod(fn, 1000);

    await each(range(1, 10), async function() {
      await p(b++);
    });

    expect(results).to.eql({0 : 0, 1 : 9});
  });

  it('with no period', async function() {

    var results    = {};
    var a          = 0;
    var b          = 0;
    var fn         = async function (c) {
      results[a++] = c;
    };
    var p          = throttlePeriod(fn);

    await each(range(1, 10), async function() {
      await p(b++);
    });

    expect(results).to.eql({0 : 0, 1 : 9});
  });

});
