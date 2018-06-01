"use strict";


const expect  = require('expect.js');

const setLoop = require('../../async/setLoop');
const sleep   = require('../../async/sleep');

describe("testing timeout", function() {
  this.timeout(5 * 1000);

  it("should test setloop", async () => {
    var i = 0, errs = [];
    var fail5 = function(what) {
      if(++i > 5)
        throw "Definitively not";
      errs.push(what);
    };

    try {
      await setLoop(async () => {
        await sleep(100);
        throw "nope";
      }, 200, fail5);

      expect().to.fail("Never here");
    } catch(err) {

      expect(err).to.be("Definitively not");
      expect(errs).to.eql(["nope", "nope", "nope", "nope", "nope"]);
    }

  });



  it("should test setloop (console)", async () => {
    var i = 0;

    try {
      await setLoop(async () => {
        await sleep(100);
        if(i++ == 5)
          throw "nope";
      }, 200);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.be("nope");
    }


  });


});
