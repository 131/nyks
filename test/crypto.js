"use strict";

/* global it describe */

const expect = require('expect.js');

const md5         = require('../crypto/md5');
//const openssh2pem = require('../crypto/openssh2pem');
const pemme       = require('../crypto/pemme');
const sha1        = require('../crypto/sha1');

describe("Crypto testing functions", function() {
  it("should test cannonical md5", function() {
    expect(md5("")).to.be("d41d8cd98f00b204e9800998ecf8427e");
  });

  it("should test sha1", function() {
    expect(sha1("Hello")).to.be("f7ff9e8b7bb2e09b70935a5d785e0cc5d9d0abf0");
  });

  it("should test pemme", function() {
    expect(pemme("Hello", "WRAPPER")).to.be(`-----BEGIN WRAPPER-----\nHello\n-----END WRAPPER-----`);
  });

  it("should test pemme from Buffer", function() {
    expect(pemme(new Buffer("Hello"), "WRAPPER")).to.be(`-----BEGIN WRAPPER-----\nSGVsbG8=\n-----END WRAPPER-----`);
  });
});
