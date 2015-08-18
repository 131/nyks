"use strict";

var expect = require('expect.js')
var md5 = require('../crypt/md5')


describe("Crypto testing functions", function(){

    it("should test cannonical md5", function(){
        expect(md5("")).to.be("d41d8cd98f00b204e9800998ecf8427e");
    });
});
