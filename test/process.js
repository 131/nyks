"use strict";


const expect     = require('expect.js');

const formatArgs = require('../process/formatArgs');
const parseArgs  = require('../process/parseArgs');
const splitArgs  = require('../process/splitArgs');
const trim = require('mout/string/trim');

describe("Process functions", function() {



  it("Should test formatArgs", function() {
    expect(formatArgs({foo : 'foo', bar : 'bar'})).to.eql(["--foo=foo", "--bar=bar"]);
    expect(formatArgs({foo : 'foo', bar : 'bar'}, true)).to.eql(["--foo", "foo", "--bar", "bar"]);
    expect(formatArgs({foo : true, bar : 'bar'})).to.eql(["--foo", "--bar=bar"]);
    expect(formatArgs({foo : null})).to.eql([]);
    expect(formatArgs()).to.eql([]);
    expect(formatArgs({foo : [1, 2, 3]})).to.eql(["--foo=1", "--foo=2", "--foo=3"]);
  });

  it("should test splitArgs on void", function() {
    //argv0 must be a string...
    expect(splitArgs()).to.eql([]);
    expect(splitArgs(false)).to.eql([]);
    expect(splitArgs(0)).to.eql([]);
    expect(splitArgs(null)).to.eql([]);

    expect(splitArgs("")).to.eql([]);
    expect(splitArgs(" ")).to.eql([]);
    expect(splitArgs(" 0")).to.eql([0]);
    expect(splitArgs(" 0 ")).to.eql([0]);
    expect(splitArgs(' "0" ')).to.eql(["0"]);
  });

  it("should test splitArgs", function() {
    expect(splitArgs("--foo=42 bar -- --this --is --unparsed")).to.eql(["--foo=42", "bar", "--", "--this --is --unparsed"]);
    expect(splitArgs("--foo=42 bar -- --this --is --u'nparsed")).to.eql(["--foo=42", "bar", "--", "--this --is --u'nparsed"]);

    expect(splitArgs(" a b c  d")).to.eql(["a", "b", "c", "d"]);
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
  });

  it("should test splitArgs - multibloc", function() {

    expect(splitArgs("'foo''foobar'")).to.eql(["foofoobar"]);
    expect(splitArgs("'foo'kfdokf'fooo'")).to.eql(["fookfdokffooo"]);
    expect(splitArgs("'foo'kfd-- okf'fooo'")).to.eql(["fookfd--", "okffooo"]);


    var test = '"C:\\FOO Client\\app\\node-webkit\\nw.exe" --mixed-context --explicitly-allowed-ports=6000 --remote-debugging-port=0 --user-data-dir=./Data/.nwjscache --user-data-dir="C:\\FOO Client\\Data\\.nwjscache" --no-sandbox --no-zygote --flag-switches-begin --flag-switches-end --nwapp="App\\app" --original-process-start-time=13200767136475118 "App\\app" "Client\\nw.exe --autoload=demo"';


    expect(splitArgs(test)).to.eql(['C:\\FOO Client\\app\\node-webkit\\nw.exe',
      '--mixed-context',
      '--explicitly-allowed-ports=6000',
      '--remote-debugging-port=0',
      '--user-data-dir=./Data/.nwjscache',
      '--user-data-dir=C:\\FOO Client\\Data\\.nwjscache',
      '--no-sandbox',
      '--no-zygote',
      '--flag-switches-begin',
      '--flag-switches-end',
      '--nwapp=App\\app',
      '--original-process-start-time=13200767136475118',
      'App\\app',
      'Client\\nw.exe --autoload=demo']);
  });


  it("testing parseArgs", function() {
    expect(parseArgs(["--foo"])).to.eql({args : [], dict : {foo : true}, rest : undefined});

    expect(parseArgs(["--foo="])).to.eql({args : [], dict : {foo : ''}, rest : undefined});
    expect(parseArgs(['--foo=false'])).to.eql({args : [], dict : {foo : 'false'}, rest : undefined});

    expect(parseArgs(["--foo", "bar"])).to.eql({args : ["bar"], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["bar", "--foo"])).to.eql({args : ["bar"], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["bar", "--foo", "baz"])).to.eql({args : ["bar", "baz"], dict : {foo : true}, rest : undefined});
    expect(parseArgs(["--foo=42", "--foo=55"])).to.eql({args : [], dict : {foo : [42, 55]}, rest : undefined});
    expect(parseArgs(["--foo=42", "--foo=55", "--foo"])).to.eql({args : [], dict : {foo : [42, 55, true]}, rest : undefined});
    expect(parseArgs(["--foo=355f82ab-a1d0-4df3-94ab-f55a1b51bd14"])).to.eql({args : [], dict : {foo : '355f82ab-a1d0-4df3-94ab-f55a1b51bd14'}, rest : undefined});
    expect(parseArgs(["--foo=127.10.10.1"])).to.eql({args : [], dict : {foo : '127.10.10.1'}, rest : undefined});
    expect(parseArgs(splitArgs("--foo=42 bar -- --this --is --unparsed"))).to.eql({args : ["bar"], dict : {foo : 42}, rest : "--this --is --unparsed"});


  });

  it("testing parseArgs / json", function() {
    var foo = {"this" : "is", "a" : ["complex", null, 45, "object"]};
    expect(parseArgs(["--foo::json=" + JSON.stringify(foo)])).to.eql({args : [], dict : {foo}, rest : undefined});
  });

  it("testing parseArgs / base64", function() {
    var foo = {"this" : "is", "a" : ["complex", null, 45, "object"]};
    let input = trim(Buffer.from(JSON.stringify(foo)).toString('base64'), "=");
    expect(parseArgs(["--foo::json::base64=" + input])).to.eql({args : [], dict : {foo}, rest : undefined});
  });


  //invalid argument description are dropped
  it("should drop invalid args", function() {
    expect(parseArgs(["-=foo", "bar"])).to.eql({args : ["bar"], dict : {}, rest : undefined});
  });

});
