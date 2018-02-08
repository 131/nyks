"use strict";

/* global it describe */

const expect    = require('expect.js');

const defer     = require('../promise/defer');
const nodeify   = require('../promise/nodeify');

const promisify = require('../function/promisify');
const sleep     = require('../function/sleep');

describe("Promise functions", function() {

  it("should test promisify with no err", async function() {
    var sayHello = function(str, err, cb) {
      setTimeout(function() {
        cb(err, "Hello " + str);
      });
    };

    var sayHi = function(cb) { //bind that
      var self = this;
      setTimeout(function() {
        cb(null, "Hi " + self.name);
      });
    };

    var fn  = promisify(sayHello);
    var val = await fn("world", null);
    expect(val).to.be.equal("Hello world");

    try {
      await fn("world", "error");
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.be("error");
    }

    var fne = promisify(sayHi, {name : "Joe"});
    val = await fne();
    expect(val).to.be.equal("Hi Joe");
  });

  it("testing defer errors", async function() {
    var defered = defer();
    setTimeout(function() {
      defered.reject("Nope");
    }, 0);

    try {
      await defered;
    } catch(err) {
      expect(err).to.be("Nope");
    }
  });

  it("testing defer chain", async function() {
    var defered = defer();

    setTimeout(function() {
      defered.chain("Nope");
    }, 0);

    try {
      await defered;
    } catch(err) {
      expect(err).to.be("Nope");
    }

    defered = defer();
    setTimeout(function() {
      defered.chain(null, "Okay");
    }, 0);
    var result = await defered;
    expect(result).to.be("Okay");
  });

  it("testing defer sync behavior", function() {
    var defered = defer();
    defered.catch(function() {});
    defered.reject("Nope");
  });

  it("testing defer accept", async function() {
    var defered = defer();

    setTimeout(function() {
      defered.resolve("okay");
    }, 0);

    var result = await defered;

    expect(result).to.eql("okay");
  });

  it("should test nodeify", async function() {
    var lazyMath = async function(int) {
      await sleep(500);
      return int * 2;
    };

    var worker = nodeify(lazyMath);

    worker(8, function(err, result) {
      expect(result).to.be(16);
    });
  });

});
