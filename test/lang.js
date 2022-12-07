"use strict";


const expect = require('expect.js');
const binaryReviver = require('../lang/binaryReviver');
const toBool = require('../lang/toBool');

describe("Lang functions", function() {

  it("should test binaryReviver", function() {
    let input = { test : null, size : [1, 2, "ok"], color : Buffer.from([1, 2, 3]) };

    expect(JSON.parse(JSON.stringify(input))).not.to.eql(input);
    expect(JSON.parse(JSON.stringify(input), binaryReviver)).to.eql(input);
  });


  it("should test binaryReviver (raw)", function() {
    let input = Buffer.from([1, 2, 3]);

    expect(JSON.parse(JSON.stringify(input))).not.to.eql(input);
    expect(JSON.parse(JSON.stringify(input), binaryReviver)).to.eql(input);
  });


  it("should test lang/toBool", function() {
    expect(toBool(0)).not.to.be.ok();
    expect(toBool(null)).not.to.be.ok();
    expect(toBool("0")).not.to.be.ok();
    expect(toBool("false")).not.to.be.ok();
    expect(toBool(false)).not.to.be.ok();
    expect(toBool("f")).not.to.be.ok();
    expect(toBool("n")).not.to.be.ok();
    expect(toBool("")).not.to.be.ok();
    expect(toBool()).not.to.be.ok();

    expect(toBool({})).to.be.ok();
    expect(toBool(1)).to.be.ok();
    expect(toBool("y")).to.be.ok();
  });


});
