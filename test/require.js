"use strict";

const expect  = require('expect.js')
const resolve = require('../require/resolve')
const path    = require('path');


describe("Require functions", function(){

  it("testing require resolve", function(){
    var folder = resolve("expect.js");
    expect(folder).to.eql(path.join(__dirname, "..", "node_modules", "expect.js"));
  });

  it("testing require resolve failure", function(){
    try {
      var folder = resolve("nope");
      expect().fail("Never Here");
    } catch(err) {
      expect(err).to.be("nope");
    }

  });

});

