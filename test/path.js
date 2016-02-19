"use strict";

var expect = require('expect.js')
var extend = require('../path/extend')
var which  = require('../path/which')


describe("Paths functions", function(){


    it("testing extend", function(){
      expect(which("path.js")).to.eql(false);
        process.env.PATHEXT = ""; //we do not even need that
      expect(which("path.js")).to.eql(false);

      extend(__dirname);
      expect(which("path.js")).to.eql(__filename);
    });


});
