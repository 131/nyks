"use strict";


const expect = require('expect.js');


Math.log10 = null; //force alternative for testing
Math.log2  = null; //force alternative for testing

const nyks = require('../');

describe("Global nyks include", function() {

  it("Should provide love", function() {
    expect(nyks).to.be.ok();
  });

});
