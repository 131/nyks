"use strict";


const expect = require('expect.js');

const md5         = require('../crypto/md5');
const openssh2pem = require('../crypto/openssh2pem');
const pemme       = require('../crypto/pemme');
const sha1        = require('../crypto/sha1');
const createHash  = require('../crypto/createHash');
const decodeBase32 = require('../crypto/base32');


const fs   = require('fs');
const path = require('path');

describe("Base32 testing functions", function() {
  const testSet = [
    // RFC 4648 - Random data
    ['73', 'OM======'],
    ['f80c', '7AGA===='],
    ['6450', 'MRIA===='],
    ['cc91d0', 'ZSI5A==='],
    ['6c60c0', 'NRQMA==='],
    ['4f6a23', 'J5VCG==='],
    ['88b44f18', 'RC2E6GA='],
    ['90bad04714', 'SC5NARYU'],
    ['e9ef1def8086', '5HXR334AQY======'],
    ['83fe3f9c1e9302', 'QP7D7HA6SMBA===='],
    ['15aa1f7cafc17cb8', 'CWVB67FPYF6LQ==='],
    ['da51d4fed48b4c32dc', '3JI5J7WURNGDFXA='],
    ['c4be14228512d7299831', 'YS7BIIUFCLLSTGBR'],
    ['2f273c5b5ef04724fab944', 'F4TTYW266BDSJ6VZIQ======'],
    ['969da1b80ec2442d2bdd4bdb', 'S2O2DOAOYJCC2K65JPNQ===='],
    ['31f5adb50792f549d3714f3f99', 'GH223NIHSL2UTU3RJ47ZS==='],
    ['6a654f7a072c29951930700c0a61', 'NJSU66QHFQUZKGJQOAGAUYI='],
    ['0fe29d6825ad999e87d9b7cac3589d', 'B7RJ22BFVWMZ5B6ZW7FMGWE5'],
    ['0f960ab44e165973a5172ccd294b3412', 'B6LAVNCOCZMXHJIXFTGSSSZUCI======'],
    ['325b9fd847a41fb0d485c207a1a5b02dcf', 'GJNZ7WCHUQP3BVEFYID2DJNQFXHQ===='],
    ['ddf80ebe21bf1b1e12a64c5cc6a74b5d92dd', '3X4A5PRBX4NR4EVGJROMNJ2LLWJN2==='],
    ['c0cae52c6f641ce04a7ee5b9a8fa8ded121bca', 'YDFOKLDPMQOOAST64W42R6UN5UJBXSQ='],
    ['872840a355c8c70586f462c9e669ee760cb3537e', 'Q4UEBI2VZDDQLBXUMLE6M2POOYGLGU36'],
    ['5773fe22662818a120c5688824c935fe018208a496', 'K5Z74ITGFAMKCIGFNCECJSJV7YAYECFESY======'],
    ['416e23abc524d1b85736e2bea6cfecd5192789034a28', 'IFXCHK6FETI3QVZW4K7KNT7M2UMSPCIDJIUA===='],
    ['83d2386ebdd7e8e818ec00e3ccd882aa933b905b7e2e44', 'QPJDQ3V527UOQGHMADR4ZWECVKJTXEC3PYXEI==='],
    ['a2fa8b881f3b8024f52745763c4ae08ea12bdf8bef1a72f8', 'UL5IXCA7HOACJ5JHIV3DYSXAR2QSXX4L54NHF6A='],
    ['b074ae8b9efde0f17f37bccadde006d039997b59c8efb05add', 'WB2K5C467XQPC7ZXXTFN3YAG2A4ZS62ZZDX3AWW5'],
    ['764fef941aee7e416dc204ae5ab9c5b9ce644567798e6849aea9', 'OZH67FA25Z7EC3OCASXFVOOFXHHGIRLHPGHGQSNOVE======'],
    ['4995d9811f37f59797d7c3b9b9e5325aa78277415f70f4accf588c', 'JGK5TAI7G72ZPF6XYO43TZJSLKTYE52BL5YPJLGPLCGA===='],
    ['24f0812ca8eed58374c11a7008f0b262698b72fd2792709208eaacb2', 'ETYICLFI53KYG5GBDJYAR4FSMJUYW4X5E6JHBEQI5KWLE==='],
    ['d70692543810d4bf50d81cf44a55801a557a388a341367c7ea077ca306', '24DJEVBYCDKL6UGYDT2EUVMADJKXUOEKGQJWPR7KA56KGBQ='],
    ['6e08a89ca36b677ff8fe99e68a1241c8d8cef2570a5f60b6417d2538b30c', 'NYEKRHFDNNTX76H6THTIUESBZDMM54SXBJPWBNSBPUSTRMYM'],
    ['f2fc2319bd29457ccd01e8e194ee9bd7e97298b6610df4ab0f3d5baa0b2d7ccf69829edb74edef', '6L6CGGN5FFCXZTIB5DQZJ3U327UXFGFWMEG7JKYPHVN2UCZNPTHWTAU63N2O33Y=']
  ];
  it(`should test decodeBase32`, function() {
    for(const [b16, b32] of testSet)
      expect(decodeBase32(b32)).to.eql(Buffer.from(b16, 'hex'));

  });
});

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
