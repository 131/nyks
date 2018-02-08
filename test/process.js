"use strict";
/* eslint-env node,mocha */


const expect     = require('expect.js');

const formatArgs = require('../process/formatArgs');
const parseArgs  = require('../process/parseArgs');
const splitArgs  = require('../process/splitArgs');

describe("Process functions", function() {

  it("Should test formatArgs", function() {
    expect(formatArgs({foo : 'foo', bar : 'bar'})).to.eql(["--foo=foo", "--bar=bar"]);
    expect(formatArgs({foo : 'foo',bar : 'bar'}, true)).to.eql(["--foo", "foo", "--bar", "bar"]);
    expect(formatArgs({foo : true, bar : 'bar'})).to.eql(["--foo", "--bar=bar"]);
    expect(formatArgs({foo : null})).to.eql([]);
    expect(formatArgs()).to.eql([]);
    expect(formatArgs({foo : [1, 2, 3]})).to.eql(["--foo=1", "--foo=2", "--foo=3"]);
  });

  it("should test splitArgs", function() {
    expect(splitArgs("--foo=42 bar -- --this --is --unparsed")).to.eql(["--foo=42", "bar", "--", "--this --is --unparsed"]);

    expect(splitArgs("a b c  d")).to.eql(["a", "b", "c", "d"]);
    expect(splitArgs("a 127.0.0.1 d")).to.eql(["a", "127.0.0.1", "d"]);
    expect(splitArgs("a 12 d")).to.eql(["a", 12, "d"]);
    expect(splitArgs("a 'b' c  d")).to.eql(["a", "b", "c", "d"]);
    expect(splitArgs("a \"b\" c  d")).to.eql(["a", "b", "c", "d"]);
    expect(splitArgs("a \"'b'\" c  d")).to.eql(["a", "'b'", "c", "d"]);
    expect(splitArgs("a \"'b c'\" c  d")).to.eql(["a", "'b c'", "c", "d"]);
    expect(splitArgs("a 'b c' c  d 8")).to.eql(["a", "b c", "c", "d", 8]);
    expect(splitArgs("")).to.eql([]);
    expect(splitArgs('""')).to.eql(['']);
    expect(splitArgs('"0.124"')).to.eql([0.124]);
    expect(typeof splitArgs('"0.124"')[0]).to.eql("string");
    expect(typeof splitArgs("12")[0]).to.eql("number");
    expect(typeof splitArgs("0")[0]).to.eql("number");

    expect(splitArgs("'foo''foobar'")).to.eql(["foo"]);
    expect(splitArgs("'foo'foobar'")).to.eql(["foo"]);
  });

  it("testing parseArgs", function() {
    expect(parseArgs(["--foo"])).to.eql({args : [], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["--foo", "bar"])).to.eql({args : ["bar"], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["bar", "--foo"])).to.eql({args : ["bar"], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["bar", "--foo", "baz"])).to.eql({args : ["bar", "baz"], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["--foo=42", "--foo=55"])).to.eql({args : [], dict : {foo : [42, 55]}, rest : undefined});
    expect(parseArgs(["--foo=42", "--foo=55", "--foo"])).to.eql({args : [], dict : {foo : [42, 55, true]}, rest : undefined});
    expect(parseArgs(["--foo=355f82ab-a1d0-4df3-94ab-f55a1b51bd14"])).to.eql({args : [], dict : {foo : '355f82ab-a1d0-4df3-94ab-f55a1b51bd14'}, rest : undefined});
    expect(parseArgs(["--foo=127.10.10.1"])).to.eql({args : [], dict : {foo : '127.10.10.1'}, rest : undefined});
    expect(parseArgs(splitArgs("--foo=42 bar -- --this --is --unparsed"))).to.eql({args : ["bar"], dict : {foo : 42}, rest : "--this --is --unparsed"});
  });

  //invalid argument description are dropped
  it("should drop invalid args", function() {
    expect(parseArgs(["-=foo", "bar"])).to.eql({args : ["bar"], dict : {}, rest : undefined});
  });

});
