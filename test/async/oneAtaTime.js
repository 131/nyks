"use strict";
/* eslint-env node,mocha */


const expect     = require('expect.js');

const oneAtaTime = require('../../async/oneAtATime');

const sleep      = require('../../async/sleep');

describe("testing one at a time", function() {

  it("should not change original function", async function () {
    var resolve = async function(a) {
      this.name = a;
      await sleep(200);
      return "done " + a;
    };

    var reject = async function() {
      await sleep(200);
      throw "reject";
    };

    var oneAtATImeResolve = oneAtaTime(resolve);
    var oneAtATImeReject  = oneAtaTime(reject);

    try {
      /* eslint-disable */
      var rej = await oneAtATImeReject();
      /* eslint-enable */
    } catch(err) {
      expect(err).to.eql("reject");
    }

    var foo = {
      name : "nope",
      fn   : oneAtATImeResolve,
    };
    var bar = {};

    var res = await foo.fn("cool");
    expect(res).to.eql("done cool");
    expect(foo.name).to.eql("cool");

    foo = {
      name : "nope",
      fn   : oneAtaTime(resolve, bar),
    };

    await foo.fn("test 55");
    expect(bar.name).to.eql("test 55");
  });

  it("should emmit error if run simultaneously", async function() {
    var a       = 0;
    var wait200 = async function() {
      a = a + 1 ;
      await sleep(200);
      return "done";
    };

    var runOneAtATIme = oneAtaTime(wait200);
    var res           = await runOneAtATIme();

    expect(res).to.eql("done");
    expect(a).to.eql(1);
    await runOneAtATIme();
    expect(a).to.eql(2);

    try {
      res = await Promise.all([runOneAtATIme(), runOneAtATIme(), runOneAtATIme()]);
    } catch(err) {
      expect(err).to.eql("Already running !");
    }
    expect(a).to.eql(3);
    await sleep(201);
    await runOneAtATIme();
    expect(a).to.eql(4);
  });

});
