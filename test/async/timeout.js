"use strict";

const expect  = require('expect.js');
const timeout = require('../../async/timeout');
const sleep   = require('../../async/sleep');


describe("testing timeout", function() {


  it("should timeout", async function() {
    var res = await Promise.race([timeout(1200, 'Bye bye'), sleep(100)]);
    expect(res).to.be(undefined);

    try {
      await Promise.race([timeout(100, 'Bye bye'), sleep(200)]);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.eql("Bye bye");
    }

    try {
      await Promise.race([timeout(100), sleep(200)]);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.eql("timeout");
    }

  });

  it("test clearTimeout", async function() {
    let fail = timeout(100);
    fail.clearTimeout();
    await Promise.race([fail, sleep(200)]);

  });



});
