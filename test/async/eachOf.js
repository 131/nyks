"use strict";

const assert = require('assert');
const expect = require('expect.js');
const sleep  = require('../../async/sleep');
const format = require('../../string/format');

const eachOf = require('../../async/eachOf');
const eachOfSeries = require('../../async/eachOfSeries');
const eachOfLimit = require('../../async/eachOfLimit');


describe("eachOf", function() {

  function eachOfNoCallbackIteratee(done, x, key, callback) {
    expect(x).to.equal(1);
    expect(key).to.equal("a");
    callback();
    done();
  }

  async function eachOfIteratee(args, value, key) {
    args.push(key, value);
    await sleep(value*25);
   return format("%s-%s", key, value);
  }


  it('eachOf', async function() {
    var args = [];
    await eachOf({ a: 1, b: 2 }, eachOfIteratee.bind(this, args));
    expect(args).to.eql(["a", 1, "b", 2]);
  });

  it('eachOf - instant resolver', async function() {
    var args = [];
    await eachOf({ a: 1, b: 2 }, async function (x, k) { args.push(k, x);});
    // ensures done callback isn't called before all items iterated
    expect(args).to.eql(["a", 1, "b", 2]);
  });

  it('eachOf empty object', async function() {
    await eachOf({}, async function (){ assert(false, 'iteratee should not be called'); });
    assert(true, 'should call callback');
  });

  it('eachOf empty array', async function() {
    await eachOf([], async function () { assert(false, 'iteratee should not be called'); });
    assert(true, 'should call callback');
  });

  it('eachOf error', async function() {
    try {
      await eachOf({ a: 1, b: 2 }, function(value, key) { throw 'error' });
      throw "Never here";
    } catch(err) {
      expect(err).to.equal('error');
    }
  });

  // per design eachOf no callback cannot be tested

  it('eachOf with array', async function() {
    var args = [];
    await eachOf([ "a", "b" ], eachOfIteratee.bind(this, args));
    expect(args).to.eql([0, "a", 1, "b"]);
  });

  //for now, Set and Map iterators arent supported  (never used of them)

/*
  it('eachOf with Set (iterators)', async function() {
    if (typeof Set !== 'function')
      return;

    var args = [];
    var set = new Set();
    set.add("a");
    set.add("b");
    await eachOf(set, eachOfIteratee.bind(this, args));
    expect(args).to.eql([0, "a", 1, "b"]);
  });


  it('eachOf with Map (iterators)', async function() {
    if (typeof Map !== 'function')
      return;

    var args = [];
    var map = new Map();
    map.set(1, "a");
    map.set(2, "b");
    await eachOf(map, eachOfIteratee.bind(this, args));
    expect(args).to.eql([0, [1, "a"], 1, [2, "b"]]);
  });
*/

  it('eachOfSeries', async function() {
    var args = [];
    var res = await eachOfSeries({ a: 1, b: 2 }, eachOfIteratee.bind(this, args));
    expect(args).to.eql([ "a", 1, "b", 2 ]);
    expect(res).to.eql({ 'a': 'a-1', 'b': 'b-2' });
  });

  it('eachOfSeries empty object', async function() {

    await eachOfSeries({}, function(){ assert(false, 'iteratee should not be called');});
    assert(true, 'should call callback');
  });

  it('eachOfSeries error', async function() {
    var call_order = [];
    try {
      await eachOfSeries({ a: 1, b: 2 }, function(value, key){
        call_order.push(value, key);
        throw 'error';
      });
      throw "Not there";
    } catch(err) {
      expect(call_order).to.eql([ 1, "a" ]);
      expect(err).to.equal('error');
    }

  });

  // per design eachOfSeries no callback cannot be tested

  it('eachOfSeries with array', async function() {
    var args = [];
    await eachOfSeries([ "a", "b" ], eachOfIteratee.bind(this, args));
    expect(args).to.eql([ 0, "a", 1, "b" ]);
  });

  it('eachOfLimit', async function() {
    var args = [];
    var obj = { a: 1, b: 2, c: 3, d: 4 };

    await eachOfLimit(obj, 2, async function (value, key){
      await sleep(value * 5);
      args.push(value * this.b, key);
    }, obj);

    expect(args).to.eql([ 2, "a", 4, "b", 6, "c", 8, "d" ]);
  });


});
