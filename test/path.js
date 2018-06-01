"use strict";


const expect = require('expect.js');
const path   = require('path');

const extend = require('../path/extend');
const jail   = require('../path/jail');
const which  = require('../path/which');

describe("Paths functions", function() {

  it("testing extend", function() {
    expect(which("path.js")).to.eql(false);
    process.env.PATHEXT = ""; //we do not even need that
    expect(which("path.js")).to.eql(false);

    extend(__dirname);
    expect(which("path.js")).to.eql(__filename);
  });

  it("testing fail", function() {
    expect(function() { jail(__dirname, "../../etc/host"); }).to.throwException(/escape attempt/);
    expect(jail(__dirname, "ab", "..", "cd")).to.eql(path.join(__dirname, 'ab/../cd'));
  });

});
