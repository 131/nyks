"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');
const assert = require('assert');

const each       = require('../../async/each');
const eachLimit  = require('../../async/eachLimit');
const eachSeries = require('../../async/eachSeries');

const sleep      = require('../../async/sleep');

describe("each", function() {

  async function eachIteratee(args, x) {
    await sleep(x * 100);
    args.push(x);
    return x;
  }

  it('each', async function () {
    var args = [];
    await each([1, 3, 2], eachIteratee.bind(this, args));
    expect(args).to.eql([1, 2, 3]);
  });

  it('each return value', async function () {
    var args     = [];
    var response = await each([1, 3, 2], eachIteratee.bind(this, args));
    expect(args).to.eql([1, 2, 3]);
    expect(response).to.eql([1, 3, 2]);
  });

  //per design, each extra callback cannot be tested
  //per design, each no callback cannot be tested
  it('each empty array', async function () {
    await each([], function() {
      throw 'iteratee should not be called';
    });
    expect(true).to.be.ok();
  });

  it('each error', async function() {
    try {
      await each([1, 2, 3], async function () { throw 'error'; });
      throw "Never here";
    } catch(err) {
      expect(err).to.equal('error');
    }
  });

  it('each empty array, with other property on the array', async function () {
    var myArray = [];
    myArray.myProp = "anything";
    await each(myArray, async function () { throw 'error'; });
    assert(true, 'should call callback');
  });

  it('eachSeries', async function () {
    var args = [];
    await eachSeries([1, 3, 2], eachIteratee.bind(this, args));
    expect(args).to.eql([1, 3, 2]);
  });

  it('eachSeries empty array', async function () {
    await eachSeries([], async function () { assert(false, 'iteratee should not be called'); });
    assert(true, 'should call callback');
  });

  //per design, eachSeries array modification cannot be tested
  //per design, eachSeries single item cannot be reproduced
  //per design, eachSeries no callback cannot be tested
  it('eachSeries error', async function () {
    var call_order = [];
    try {
      await eachSeries([1, 2, 3], async function (x) {
        call_order.push(x);
        throw "error";
      });
      throw "Never here";
    } catch(err) {
      expect(call_order).to.eql([1]);
      expect(err).to.equal('error');
    }
  });

  it('eachLimit', async function () {
    var args = [];
    var arr  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    await eachLimit(arr, 2, async function (x) {
      await sleep(x * 5);
      args.push(x);
    });

    expect(args).to.eql(arr);
  });

  it('eachLimit empty array', async function () {
    await eachLimit([], 2, async function () {
      assert(false, 'iteratee should not be called');
    });
    assert(true, 'should call callback');
  });

  it('eachLimit limit exceeds size', async function () {
    var args = [];
    var arr  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    await eachLimit(arr, 20, eachIteratee.bind(this, args));
    expect(args).to.eql(arr);
  });

  it('eachLimit limit equal size', async function () {
    var args = [];
    var arr  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    await eachLimit(arr, 10, eachIteratee.bind(this, args));
    expect(args).to.eql(arr);
  });

  //per sanity eachLimit zero limit will never be supported
  //per design eachLimit no callback cannot be tested
  it('eachLimit error', async function () {
    var arr        = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var call_order = [];

    try {
      await eachLimit(arr, 3, async function (x) {
        call_order.push(x);
        if(x === 2)
          throw 'error';
      });
      throw "never here";
    } catch(err) {
      expect(call_order).to.eql([0, 1, 2]);
      expect(err).to.equal('error');
    }
  });

  it('eachLimit synchronous', async function () {
    var args = [];
    var arr  = [0, 1, 2];
    await eachLimit(arr, 5, async function(x) { args.push(x); });
    expect(args).to.eql(arr);
  });

  it('eachLimit does not continue replenishing after error', async function () {
    var started = 0;
    var arr     = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var delay   = 10;
    var limit   = 3;
    var maxTime = 10 * arr.length;

    await Promise.all([
      async function() {
        try {
          await eachLimit(arr, limit, async function () {
            started++;
            if(started === 3)
              throw "Test Error";
            await sleep(delay);
          });
          throw "Not there";
        } catch(err) {
          expect(err).to.eql("Test Error");
        }
      },
      async function() {
        await sleep(maxTime);
        expect(started).to.equal(3);
      }
    ]);
  });

});
