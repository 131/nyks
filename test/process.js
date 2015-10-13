"use strict";

var expect    = require('expect.js')
var parseArgs = require('../process/parseArgs')
var splitArgs = require('../process/splitArgs')




describe("Process functions", function(){


    it("testing parseArgs", function(){
      expect(parseArgs(["--foo"]) ).to.eql({args : [], dict : {foo:true}});
      expect(parseArgs(["--foo", "bar"]) ).to.eql({args : ["bar"], dict : {foo:true}});
      expect(parseArgs(["bar", "--foo"]) ).to.eql({args : ["bar"], dict : {foo:true}});
      expect(parseArgs(["bar", "--foo", "baz"]) ).to.eql({args : ["bar", "baz"], dict : {foo:true}});
      expect(parseArgs(["--foo=42", "--foo=55"]) ).to.eql({args : [], dict : {foo:[42, 55]}});
      expect(parseArgs(["--foo=42", "--foo=55", "--foo"]) ).to.eql({args : [], dict : {foo:[42, 55, true]}});
    });


        //invalid argument description are dropped

    it("should drop invalid args", function(){
      expect(parseArgs(["-=foo", "bar"]) ).to.eql({args : ["bar"], dict : {}});
    });


    it("should test splitArgs", function(){
      expect(splitArgs("a b c  d") ).to.eql(["a", "b", "c", "d"]);
      expect(splitArgs("a 'b' c  d") ).to.eql(["a", "b", "c", "d"]);
      expect(splitArgs("a \"b\" c  d") ).to.eql(["a", "b", "c", "d"]);
      expect(splitArgs("a \"'b'\" c  d") ).to.eql(["a", "'b'", "c", "d"]);
      expect(splitArgs("a \"'b c'\" c  d") ).to.eql(["a", "'b c'", "c", "d"]);
      expect(splitArgs("a 'b c' c  d 8") ).to.eql(["a", "b c", "c", "d", 8]);
      expect(splitArgs("") ).to.eql([]);


      expect(splitArgs("'foo''foobar'") ).to.eql(["foo"]);
      expect(splitArgs("'foo'foobar'") ).to.eql(["foo"]);
      
    });

});
