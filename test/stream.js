"use strict";


const fs     = require('fs');
const expect = require('expect.js');

const tmppath    = require('../fs/tmppath');

const drain      = require('../stream/drain');
const read       = require('../stream/read');
const fromBuffer = require('../stream/fromBuffer');
const pipe       = require('../stream/pipe');


const { PassThrough  } = require('stream');



describe("Stream functions", function() {

  it("should test drain", function(done) {
    var body  = "café";
    var buf   = new Buffer(body);
    var input = fromBuffer(buf);

    drain(input).then(function(contents) {
      expect("" + contents).to.eql(body);
      done();
    });
  });

  it("should test pipe 0", async function() {
    var body     = "café";
    var buf      = new Buffer(body);
    var tmp_path = tmppath("too");
    var dest     = fs.createWriteStream(tmp_path);
    var input    = fromBuffer(buf);

    await pipe(input, dest);
    expect("" + fs.readFileSync(tmp_path)).to.eql(body);
    fs.unlinkSync(tmp_path);
  });

  it("should test pipe 1", async function() {
    var body     = "café";
    var buf      = new Buffer(body);
    var tmp_path = tmppath("too");
    var input    = new Promise(function(resolve) {
      resolve(fromBuffer(buf));
    });
    var dest     = new Promise(function(resolve) {
      resolve(fs.createWriteStream(tmp_path));
    });

    await pipe(input, dest);
    expect("" + fs.readFileSync(tmp_path)).to.eql(body);
    fs.unlinkSync(tmp_path);
  });

  it("should test pipe 2", async function() {
    var body  = "café";
    var buf   = new Buffer(body);
    var input = fromBuffer(buf);
    var dst   = new PassThrough();

    await pipe(input, dst);

    let contents = await drain(dst);
    expect("" + contents).to.eql(body);
  });

  it("should test read", async function() {
    var body  = "café";
    var buf   = new Buffer(body);
    var input = fromBuffer(buf, false);

    await read(input).then(function(contents) {
      expect("" + contents).to.eql(body);
    });

    input.pause();
    input.write("foo");

    await read(input).then(function(contents) {
      expect("" + contents).to.eql("foo");
    });

    input.end();
    await read(input).then(function(contents) {
      expect(contents).to.eql(null);
    });
    input.resume();
    await read(Promise.resolve(input)).then(function(contents) {
      expect(contents).to.eql(null);
    });

  });

  it("should test read crash", async function() {
    var body  = "café";
    var buf   = new Buffer(body);
    var input = fromBuffer(buf, false);

    await read(input).then(function(contents) {
      expect("" + contents).to.eql(body);
    });

    setTimeout(function() { input.emit("error", "foo"); }, 100);
    try {
      await read(input);
      throw "Never here";
    } catch(err) {
      expect(err).to.eql("foo");
    }

  });


  it("should test drain (from a promise)", function(done) {
    var body  = "café";
    var buf   = new Buffer(body);
    var input = Promise.resolve(fromBuffer(buf));

    drain(input).then(function(contents) {
      expect("" + contents).to.eql(body);
      done();
    });
  });

  it("Draining twice should do", function(done) {
    var body  = "café";
    var buf   = new Buffer(body);
    var input = Promise.resolve(fromBuffer(buf));

    drain(input).then(function(contents) {
      expect("" + contents).to.eql(body);
      drain(input).then(function(contents2) {
        expect("" + contents2).to.eql("");
        done();
      });
    });
  });



});
