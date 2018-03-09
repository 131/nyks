"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const fromASCII = require('../buffer/fromASCII');
const fromInt   = require('../buffer/fromInt');
const indexOf   = require('../buffer/indexOf');
const readUInt  = require('../buffer/readUInt');
const writeBits = require('../buffer/writeBits');

describe("Buffer writeBits", function() {

  it("should test readUInt", function() {
    expect(readUInt(fromInt(1024))).to.eql(1024);
    expect(readUInt(fromInt(3), -2)).to.eql(3);
    expect(readUInt(new Buffer([192]), 0, 2)).to.eql(3);
    expect(readUInt(new Buffer([255]), 0, 0)).to.eql(0);
    expect(readUInt(new Buffer([255, 24, 255]), 11, 2)).to.eql(3);
  });

  it("should test fromASCII", function() {
    var body = "ABCD";
    expect(fromASCII(body)).to.eql([65, 66, 67, 68]);
  });

  it("should test writeBits", function() {
    // TOUS LES OFFSETS SONT INCLUSIFS (taille mini 1) (offsetEnd = offsetStart + length - 1)
    var tmp;

    tmp = Buffer([1]);
    expect(writeBits(tmp, Buffer(0), 1)).to.eql(0);// 01100000
    expect(tmp).to.eql(Buffer([1]));

    tmp = Buffer([0]);
    expect(writeBits(tmp, Buffer([255]), 1)).to.eql(7);// 01100000
    expect(tmp).to.eql(Buffer([127]));

    tmp = Buffer([0]);
    expect(writeBits(tmp, Buffer([255]), 1, 2)).to.eql(2);// 01100000
    expect(tmp).to.eql(Buffer([96]));

    tmp = Buffer([0, 195]);
    expect(writeBits(tmp, fromInt(3), 11, -2)).to.eql(2);
    expect(tmp).to.eql(Buffer([0, 219]));

    tmp = Buffer([0, 0, 0, 195]);
    expect(writeBits(tmp, fromInt(3), 27, -2)).to.eql(2);
    expect(tmp).to.eql(Buffer([0, 0, 0, 219]));

    tmp = Buffer([0]);
    expect(writeBits(tmp, Buffer([192]), 0, 2)).to.eql(2);
    expect(tmp).to.eql(Buffer([192]));

    // [195] 11000011
    // [219] 11011011 (write 3 at 4)

    // [129, 5, 39] 10000001 00000101 00100111
    // [129, 5, 39] 10001000 10000101 00100111  (write 17 at 4)
    tmp = Buffer([129, 5, 39]);
    expect(writeBits(tmp, fromInt(17), 4, -5)).to.eql(5);
    expect(tmp).to.eql(Buffer([136, 133, 39]));
  });

});


describe("Crypto Buffer indexOf", function() {

  var body  = new Buffer([1, 2, 3, 4, 5, 1]);
  var body2 = new Buffer("cat eat mouses");
  var sep   = new Buffer([3, 4, 5]);

  it("should find an easy char", function() {
    expect(indexOf(body, 1)).to.be(0);
    expect(indexOf(body, 2)).to.be(1);
    expect(indexOf(body, new Buffer([3, 4]))).to.be(2);
    expect(indexOf(body, new Buffer([95]))).to.be(-1);
  });

  it("should support offset based search", function() {
    expect(indexOf(body, sep, 0, 3)).to.be(-1);
    expect(indexOf(body, 1, 2)).to.be(5);
  });

  it("should support return -1 on failure", function() {
    expect(indexOf(body, 95)).to.be(-1);
  });

  it("should stop when desired", function() {
    expect(indexOf(body, 5, 0, 2)).to.be(-1);
    expect(indexOf(body, 5, 0, 19)).to.be(4);
    expect(indexOf(body, 6, 0, 19)).to.be(-1); //outside range
  });

  it("should search with string", function() {
    expect(indexOf(body2, "mouses")).to.be(8);
    expect(indexOf(body2, "mouses2")).to.be(-1);
  });

});
