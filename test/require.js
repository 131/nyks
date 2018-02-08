"use strict";
/* eslint-env node,mocha */


const expect  = require('expect.js');
const path    = require('path');

const lookup  = require('../require/lookup');
const resolve = require('../require/resolve');


describe("Require functions", function() {

  it("Should test require resolve", function() {
    var folder = resolve("expect.js");
    expect(folder).to.eql(path.join(__dirname, "..", "node_modules", "expect.js"));
  });

  it("Should test require resolve failure", function() {
    try {
      resolve("nope");
      expect().fail("Never Here");
    } catch(err) {
      expect(err).to.be("nope");
    }
  });

  it("Should test Lookup", function() {
    var expect_path = path.join(__dirname, "..", "node_modules", "expect.js", "index.js");
    expect(lookup(expect_path).name).to.be('expect.js');
  });

  it("Should test Lookup cache", function() {
    var expect_path = path.join(__dirname, "..", "node_modules", "expect.js", "index.js");
    expect(lookup(expect_path).name).to.be('expect.js');
  });

  it("Should test Lookup throw", function() {
    var toto_path = path.join(__dirname, "..", "..", "nop.js");

    try {
      lookup(toto_path);
      expect().fail("Never here");
    } catch (err) {
      expect(err).to.be(`can't find ${toto_path} package`);
    }
  });

});

