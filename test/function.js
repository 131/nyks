"use strict";

var expect = require('expect.js')
var once   = require('../function/once')
var detach = require('../function/detach')


describe("Testing functions helpers", function(){

    it("should test once", function(){


        var a = 0, f  = function(){ return (a+= 1); }, g = once(f);

        f(); f();
        expect(a).to.be(2);
        g(); g();
        expect(a).to.be(3);
        expect(g()).to.be(3);


    });


    it("should test detach", function(chain){
        var a = 0, b = 0 , c = function(i){ b+= i; }, d = detach(c);

        c(1);
        expect(b).to.be(1);

        d(2);
        expect(b).to.be(1);


        setTimeout(function(){
          expect(b).to.be(3);
          chain();
        }, 100);

    });



});



