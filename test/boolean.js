"use strict";

var expect = require('expect.js')
var toBool = require('../lang/toBool')




describe("Boolean functions", function(){

    it("should test lang/toBool", function(){
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
