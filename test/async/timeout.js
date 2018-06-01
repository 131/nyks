"use strict";

const expect  = require('expect.js');

const timeout = require('../../async/timeout');

const sleep   = require('../../async/sleep');

describe("testing timeout", function() {

  it("should not change original function", async function() {
    var resolve = async function(a) {
      await sleep(100);
      return "done " + a;
    };

    var reject = async function() {
      await sleep(100);
      throw "reject";
    };

    var Resolve               = timeout(resolve, 300);
    var Reject                = timeout(reject, 300);
    var resolveWithoutTimeout = timeout(resolve);

    try {
      await Reject();
    } catch(err) {
      expect(err).to.eql("reject");
    }

    var res   = await Resolve("cool");
    expect(res).to.eql("done cool");

    res = await resolveWithoutTimeout("cool 2");
    expect(res).to.eql("done cool 2");
  });

  it("should not run with bad argument", async function() {
    var resolve = async function() {
      await sleep(100);
      return "done";
    };

    try {
      timeout(resolve, "aze");
      expect.fail("Never here");
    } catch(err) {
      expect(err).to.eql("timeout must be a number");
    }
  });

  it("should timout", async function() {
    var time       = 100;
    var testTimout = async function() {
      await sleep(time);
      return "pass";
    };

    var passTimeout  = timeout(testTimout, time + 5);
    var crachTimeout = timeout(testTimout, time - 5);

    var data = await passTimeout();
    expect(data).to.eql("pass");
    try {
      await crachTimeout();
    } catch(err) {
      expect(err).to.eql("timeout");
    }
  });

});
