"use strict";

var expect = require('expect.js')
var indexOf = require('../buffer/indexOf')


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
