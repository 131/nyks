"use strict";

var expect = require('expect.js')
var stripStart = require('../string/stripStart')
var stripEnd = require('../string/stripEnd')
var replaces = require('../string/replaces')
var rreplaces = require('../string/rreplaces')
var rot13 = require('../string/rot13')
var crc32 = require('../string/crc32')
var chunk = require('../string/chunk')
var sprintf = require('../string/sprintf');
var hexToRgb = require('../string/hexToRgb');




describe("strings functions", function(){

    it("should test replaces", function(){
        var str = "You know &what;, &who;";
        var challenge = "You know nothing, John Snow";
        var data = {
          '&who;' : 'John Snow',
          '&what;' : 'nothing',
        };
        expect(replaces(str, data)).to.be(challenge);
        expect(replaces(str, {})).to.be(str);
        expect(replaces(str + str, data)).to.be(challenge + str);
    });

    it("should test rreplaces", function(){
        var str = "You know &&wh;at;, &&wh;o;";
        var challenge = "You know nothing, John Snow";
        var data = {
          '&who;' : 'John Snow',
          '&what;' : 'nothing',
          '&wh;' : 'wh',
        };
        expect(rreplaces(str, data)).to.be(challenge);
        expect(rreplaces(str + str, data)).to.be(challenge + challenge);
    });


    it("shoult test rot13", function(){
        expect(rot13("a")).to.be("n");
        expect(rot13("A")).to.be("N");
        expect(rot13("n")).to.be("a");
      
    });

    it("shoult test chunk", function(){
        expect(chunk("abc",1)).to.eql(["a","b", "c"]);
        expect(chunk("abc")).to.eql(["a","b", "c"]);
        expect(chunk("abc",2)).to.eql(["ab", "c"]);
        expect(chunk("abc",0)).to.eql(["abc"]);
      
    });


    it("should test stripStart", function(){
        var prefix = "longstring-", body = "with a prefix", str = prefix + body;
        
        expect(stripStart(str, prefix)).to.be(body);
        expect(stripStart("", prefix)).to.be("");
        expect(stripStart(body, prefix)).to.be(body);
        expect(stripStart(body, "")).to.be(body);

    });

    it("should test stripEnd", function(){
        var tail = "-tail", body = "this is boudy", str = body + tail;
        
        expect(stripEnd(str, tail)).to.be(body);
        expect(stripEnd(body, "")).to.be(body);
        expect(stripEnd("", tail)).to.be("");
        expect(stripEnd(str, body)).to.be(str);

    });


  it("should test sprinf", function(){

    expect(sprintf('Hallo %s!', 'Welt')).to.be('Hallo Welt!');

  });



  it("should test crc32", function(){
    expect(crc32("foobar")).to.be(-1628037227);
  });

  it("should test hexToRgb", function() {
    expect(hexToRgb('#FF0000')).to.eql(['FF', '00', '00']);

    expect(hexToRgb('not_an_hexa')).to.be(null);
  });

});
