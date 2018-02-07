"use strict";

/* global it describe */

const expect  = require('expect.js');
const path    = require('path');

//const lookup  = require('../require/lookup');
const resolve = require('../require/resolve');


describe("Require functions", function() {

  it("testing require resolve", function() {
    var folder = resolve("expect.js");
    expect(folder).to.eql(path.join(__dirname, "..", "node_modules", "expect.js"));
  });

  it("testing require resolve failure", function() {
    try {
      /* eslint-disable */
      var folder = resolve("nope");
      /* eslint-enable */
      expect().fail("Never Here");
    } catch(err) {
      expect(err).to.be("nope");
    }
  });

});

