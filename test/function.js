"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const sleep     = require('../async/sleep');
const cache     = require('../function/cache');
const detach    = require('../function/detach');
const once      = require('../function/once');
const thunk     = require('../function/thunk');
const unary     = require('../function/unary');

describe("Testing functions helpers", function() {

  it("should test once", function() {
    var a = 0;
    var f = function() { return (a += 1); };
    var g = once(f);

    f(); f();
    expect(a).to.be(2);
    g(); g();
    expect(a).to.be(3);
    expect(g()).to.be(3);
  });

  it("should test unary", function() {

    var f = function() { return arguments.length; };
    var g = unary(f);

    expect(f(1, 2)).to.be(2);
    expect(g(1, 2)).to.be(1);
  });

  it("should test detach", function(chain) {
    var b   = 0;
    var c   = function(i) { b += i; };
    var d   = detach(c);
    var foo = detach();
    foo(); // this is useless..., but do not crash

    c(1);
    expect(b).to.be(1);

    d(2);
    expect(b).to.be(1);

    setTimeout(function() {
      expect(b).to.be(3);
      chain();
    }, 100);
  });

  it("should test cache", async () => {
    var cost = 0;

    function reverse(str) { //heavy CPU intensive operation
      cost++;
      return str.toUpperCase();
    }

    var creverse = cache(reverse, 100);

    expect(creverse("summer")).to.eql("SUMMER");
    expect(creverse("summer")).to.eql("SUMMER");
    expect(cost).to.eql(1);
    expect(creverse("winter")).to.eql("WINTER");
    expect(creverse("winter")).to.eql("WINTER");
    expect(cost).to.eql(2);

    await sleep(100 * 2);
    expect(creverse("winter")).to.eql("WINTER");
    expect(creverse("winter")).to.eql("WINTER");
    expect(creverse("winter")).to.eql("WINTER");
    expect(creverse("winter")).to.eql("WINTER");
    expect(cost).to.eql(3);
  });


  it("should test thunk", function() {

    var errorMessage = 'this is error';
    var mockData     = "this is mock data";

    new Promise(function(resolve, reject) {
      var cb = thunk(resolve, reject);
      expect(cb(null, mockData)).to.be(mockData);
    });


    new Promise(function(resolve, reject) {
      var cb = thunk(resolve, reject);
      cb(errorMessage, mockData);
    }).catch(function(err) {
      expect(err).to.be(errorMessage);
    });
  });

});
