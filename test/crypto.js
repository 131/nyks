"use strict";

/* global it describe */

const expect = require('expect.js');

const md5         = require('../crypto/md5');
const openssh2pem = require('../crypto/openssh2pem');
const pemme       = require('../crypto/pemme');
const sha1        = require('../crypto/sha1');

describe("Crypto testing functions", function() {
  it("should test cannonical md5", function() {
    expect(md5("")).to.be("d41d8cd98f00b204e9800998ecf8427e");
  });
});
