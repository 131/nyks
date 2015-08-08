"use strict";

var expect = require('expect.js')
var stripStart = require('../string/stripStart.js')
var stripEnd = require('../string/stripEnd.js')
var replaces = require('../string/replaces.js')
var rreplaces = require('../string/rreplaces.js')


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


});
