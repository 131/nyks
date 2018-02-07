"use strict";

/* global it describe */

const expect = require('expect.js');

const Int2RGBA = require('../color/Int2RGBA');
const RGBA2Int = require('../color/RGBA2Int');
const RGB2HTML = require('../color/RGB2HTML');

describe("Color functions", function() {

  it("should test RGB2Int", function() {
    expect(RGBA2Int([0, 0, 0, 0])).to.eql(0);
    expect(RGBA2Int([257, 0, 0, 0])).to.eql(1 << 24);
  });

  it("Shoud be easily reversable", function() {
    var a = {r : 0, g : 0, b : 24, a : 12};
    expect(Int2RGBA(RGBA2Int(a))).to.eql(a);

    var b  = {r : 257, g : 12, b : 24, a : 55};
    var bf = {r : 1, g : 12, b : 24, a : 55};

    expect(Int2RGBA(RGBA2Int(b))).to.eql(bf);
  });

  it("Shoud test html encoder", function() {
    var a = {r : 255, g : 0, b : 255, a : 12};
    expect(RGB2HTML(a)).to.eql("#ff00ff");
    expect(RGB2HTML([0,255,0])).to.eql("#00ff00");
  });

});
