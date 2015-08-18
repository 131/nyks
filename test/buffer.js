"use strict";

var expect = require('expect.js')
var indexOf = require('../buffer/indexOf')


describe("Crypto Buffer indexOf", function(){

    var body = new Buffer([1,2,3,4,5, 1]);

    it("should find an easy char", function(){
        expect(indexOf(body, 1)).to.be(0);
        expect(indexOf(body, 2)).to.be(1);
        expect(indexOf(body, new Buffer([3,4]) )).to.be(2);
    });


    it("should support offset based search", function(){
        expect(indexOf(body, 1, 2)).to.be(5);
    });

});
