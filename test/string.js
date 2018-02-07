"use strict";

/* global it describe */

const expect         = require('expect.js');

const capitalize     = require('../string/capitalize');
const chunk          = require('../string/chunk');
const crc32          = require('../string/crc32');
const format         = require('../string/format');
const hexToRgb       = require('../string/hexToRgb');
const prettyFileSize = require('../string/prettyFileSize');
const repeat         = require('../string/repeat');
const replaces       = require('../string/replaces');
const rot13          = require('../string/rot13');
const rreplaces      = require('../string/rreplaces');
const sprintf        = require('../string/sprintf');
const stripEnd       = require('../string/stripEnd');
const stripStart     = require('../string/stripStart');
const truncate       = require('../string/truncate');

describe("strings functions", function() {

  it("should test prettyFileSize", function() { //for normal people
    expect(prettyFileSize(0)).to.eql("0B");
    expect(prettyFileSize(1)).to.eql("1B");
    expect(prettyFileSize(1024)).to.eql("1kB");
    expect(prettyFileSize(1023)).to.eql("0.99kB");
    expect(prettyFileSize(1024 * 5 + 800)).to.eql("5.78kB");
  });

  it("should test truncate", function() {
    expect(truncate("123456789ABC")).to.be("123456789…"); //default to 10..
    expect(truncate("123456789", 8)).to.be("1234567…");
    expect(truncate("12345678", 5)).to.be("1234…");
    expect(truncate("12345678", 20)).to.be("12345678");
    expect(truncate("12345678", 5, "...")).to.be("12...");
    expect(truncate("12345678", -6, "[..]")).to.be("[..]78");
  });

  it("should test format", function() {
    expect(format("%%")).to.eql("%");
    expect(format("%d", 2)).to.eql("2");
    expect(format("%d", -2)).to.eql("-2");
    expect(format("%d %s", -2)).to.eql("-2 %s");
    var o = {go : 42};
    expect(format("%j", o)).to.eql('{"go":42}');
    o.o = o;
    expect(format("-%j-", o)).to.eql('-[Circular]-');
    expect(format("-%u ok", 42)).to.eql("-%u ok");
  });

  it("should test replaces", function() {
    var str       = "You know &what;, &who;";
    var challenge = "You know nothing, John Snow";
    var data      = {
      '&who;'  : 'John Snow',
      '&what;' : 'nothing',
    };
    expect(replaces(str, data)).to.be(challenge);
    expect(replaces(str, {})).to.be(str);
    expect(replaces(str + str, data)).to.be(challenge + str);
  });

  it("should test repeat", function() {
    var str       = "abc";
    var challenge = "abcabcabc";
    expect(repeat(str, 3)).to.be(challenge);
    expect(repeat("", 9)).to.be("");
  });

  it("should test rreplaces", function() {
    var str       = "You know &&wh;at;, &&wh;o;";
    var challenge = "You know nothing, John Snow";
    var data      = {
      '&who;'  : 'John Snow',
      '&what;' : 'nothing',
      '&wh;'   : 'wh'
    };
    expect(rreplaces(str, data)).to.be(challenge);
    expect(rreplaces(str + str, data)).to.be(challenge + challenge);
  });

  it("shoult test rot13", function() {
    expect(rot13("a")).to.be("n");
    expect(rot13("A")).to.be("N");
    expect(rot13("n")).to.be("a");
  });

  it("shoult test chunk", function() {
    expect(chunk("abc",1)).to.eql(["a","b", "c"]);
    expect(chunk("abc")).to.eql(["a","b", "c"]);
    expect(chunk("abc",2)).to.eql(["ab", "c"]);
    expect(chunk("abc",0)).to.eql(["abc"]);
  });

  it("should test stripStart", function() {
    var prefix = "longstring-";
    var body   = "with a prefix";
    var str    = prefix + body;

    expect(stripStart(str, prefix)).to.be(body);
    expect(stripStart("", prefix)).to.be("");
    expect(stripStart(body, prefix)).to.be(body);
    expect(stripStart(body, "")).to.be(body);
  });

  it("should test stripEnd", function() {
    var tail = "-tail";
    var body = "this is boudy";
    var str  = body + tail;

    expect(stripEnd(str, tail)).to.be(body);
    expect(stripEnd(body, "")).to.be(body);
    expect(stripEnd("", tail)).to.be("");
    expect(stripEnd(str, body)).to.be(str);
  });

  it("should test sprintf", function() {
    expect(sprintf('Hallo %s!', 'Welt')).to.be('Hallo Welt!');
  });

  it("should test crc32", function() {
    expect(crc32("foobar")).to.be(-1628037227);
    expect(crc32("café")).to.be(-1733475659);
  });

  it("should test hexToRgb", function() {
    expect(hexToRgb('#FF0000')).to.eql(['FF', '00', '00']);
    expect(hexToRgb('not_an_hexa')).to.be(null);
  });

  it("should test capitalize", function() { //for normal people
    expect(capitalize('florent')).to.eql("Florent");
    expect(capitalize(null)).to.be("");
    expect(capitalize('a')).to.eql("A");
  });

});
