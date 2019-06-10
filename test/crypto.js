"use strict";


const expect = require('expect.js');

const md5         = require('../crypto/md5');
const openssh2pem = require('../crypto/openssh2pem');
const pemme       = require('../crypto/pemme');
const sha1        = require('../crypto/sha1');
const createHash  = require('../crypto/createHash');

const fs   = require('fs');
const path = require('path');

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

  it("should test createHash", function() {

    let hash = createHash(["md5", "sha1", "sha256"]);

    expect(hash.digest('hex')).to.eql({
      "md5" : "d41d8cd98f00b204e9800998ecf8427e",
      "sha1" : "da39a3ee5e6b4b0d3255bfef95601890afd80709",
      "sha256" : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    });

    let hash2 = createHash("sha256");
    hash2.update(Buffer.from([0]));

    expect(hash2.digest('hex')).to.eql({
      "sha256" : "6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d",
    });
  });


  it("should test openssh2pem", function() {
    let rsa_key = "" + fs.readFileSync(path.join(__dirname, 'rsrcs', 'samble_rsa_key'));
    let pemme   = "" + fs.readFileSync(path.join(__dirname, 'rsrcs', 'rsa_to_pemme'));
    expect(openssh2pem(rsa_key)).to.be(pemme);
  });

  it("should test openssh2pem with wrong key", function() {
    let rsa_key = "not a rsa key";
    try {
      openssh2pem(rsa_key);
      expect().fail("Never here");
    } catch(err) {
      expect(err).to.be('Not rsa');
    }
  });

});
