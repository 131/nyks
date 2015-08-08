"use strict";

var expect = require('expect.js')
var once = require('../function/once')


describe("Testing functions helpers", function(){

    it("should test once", function(){


        var a = 0, f  = function(){ return (a+= 1); }, g = once(f);

        f(); f();
        expect(a).to.be(2);
        g(); g();
        expect(a).to.be(3);
        expect(g()).to.be(3);


    });



});
