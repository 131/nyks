"use strict";

var expect    = require('expect.js')
var parseargs = require('../process/parseargs')




describe("Process functions", function(){


    it("testing parseargs", function(){
      expect(parseargs(["--foo"]) ).to.eql({args : [], dict : {foo:true}});
      expect(parseargs(["--foo", "bar"]) ).to.eql({args : ["bar"], dict : {foo:true}});
      expect(parseargs(["bar", "--foo"]) ).to.eql({args : ["bar"], dict : {foo:true}});
      expect(parseargs(["bar", "--foo", "baz"]) ).to.eql({args : ["bar", "baz"], dict : {foo:true}});
      expect(parseargs(["--foo=42", "--foo=55"]) ).to.eql({args : [], dict : {foo:[42, 55]}});
      expect(parseargs(["--foo=42", "--foo=55", "--foo"]) ).to.eql({args : [], dict : {foo:[42, 55, true]}});
    });


        //invalid argument description are dropped

    it("should drop invalid args", function(){
      expect(parseargs(["-=foo", "bar"]) ).to.eql({args : ["bar"], dict : {}});
    });


});
