"use strict";

var expect = require('expect.js')
var indexOf = require('../buffer/indexOf')
var writeBits = require('../buffer/writeBits');
var fromInt   = require('../buffer/fromInt');


function trace(buf){
  var foo = require('mout/array/map')(buf).map((v) => { return ("00000000" + v.toString(2)).substr(-8) });
  console.log(foo);
}


describe("Buffer writeBits", function(){
  it("should test writeBits", function(){
     // TOUS LES OFFSETS SONT INCLUSIFS (taille mini 1) (offsetEnd = offsetStart + length - 1)
    expect(writeBits(Buffer([1]), Buffer(0), 1)).to.eql(Buffer([1]));// 01100000
    expect(writeBits(Buffer([0]), Buffer([255]), 1)).to.eql(Buffer([127]));// 01100000

    expect(writeBits(Buffer([0]), Buffer([255]), 1, 2)).to.eql(Buffer([96]));// 01100000
    expect(writeBits(Buffer([0, 195]), fromInt(3), 11, -2)).to.eql(Buffer([0, 219]));
    expect(writeBits(Buffer([0,0,0, 195]), fromInt(3), 27, -2)).to.eql(Buffer([0,0,0, 219]));
    expect(writeBits(Buffer([0]), Buffer([192]), 0, 2)).to.eql(Buffer([192]));

    // [195] 11000011
    // [219] 11011011 (write 3 at 4)


    // [129, 5, 39] 10000001 00000101 00100111
    // [129, 5, 39] 10001000 10000101 00100111  (write 17 at 4)
    expect(writeBits(Buffer([129,5,39]), fromInt(17), 4, -5)).to.eql(Buffer([136,133,39]));
  });
});


describe("Crypto Buffer indexOf", function(){

    var body = new Buffer([1,2,3,4,5, 1]);
    var body2 = new Buffer("cat eat mouses");
    var sep  = new Buffer([3,4,5]);

    it("should find an easy char", function(){
        expect(indexOf(body, 1)).to.be(0);
        expect(indexOf(body, 2)).to.be(1);
        expect(indexOf(body, new Buffer([3,4]) )).to.be(2);
        expect(indexOf(body, new Buffer([95]) )).to.be(-1);
    });


    it("should support offset based search", function(){
        expect(indexOf(body, sep,0, 3)).to.be(-1);
        expect(indexOf(body, 1, 2) ).to.be(5);
    });


    it("should support return -1 on failure", function(){
        expect(indexOf(body, 95)).to.be(-1);
    });

    it("should stop when desired", function(){
        expect(indexOf(body, 5, 0, 2)).to.be(-1);
        expect(indexOf(body, 5, 0, 19)).to.be(4);
        expect(indexOf(body, 6, 0, 19)).to.be(-1); //outside range
    });

    it("should search with string", function(){

        expect(indexOf(body2, "mouses")).to.be(8);
        expect(indexOf(body2, "mouses2")).to.be(-1);
    });




});
