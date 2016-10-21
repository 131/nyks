"use strict";

var expect = require('expect.js')
var sum    = require('../array/sum')




describe("Array functions", function(){

    it("should test sum", function(){
        expect(sum([1,2,3,4])).to.be(10);
    });

    it("should test sum of empty array", function(){
        expect(sum([])).to.be(0);
    });


});
