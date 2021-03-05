"use strict";


const expect = require('expect.js');
const os     = require('os');

const exec     = require('../child_process/exec');
const passthru = require('../child_process/passthru');
const wait     = require('../child_process/wait');

describe("Child process functions", function() {

  it("should test passthru", async () => {
    await passthru(process.execPath, ['-e', 'process.exit()']);
  });

  it("should test a failure", async () => {
    try {
      await passthru("NUL");
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).not.to.match(/Invalid process exit code/);
    }
  });

  it("should test a failure 2", async () => {
    try {
      await passthru("NUL", {cwd  : "nowhere"});
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).not.to.match(/Invalid process exit code/);
    }
  });

  it("should passthru failure", async () => {
    try {
      await passthru(process.execPath, {args : ['-e', 'process.exit(33)']});
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.match(/Invalid process exit code/);
    }
  });

  it("should test exec", function(chain) {
    exec("hostname", function(err, body) {
      expect(err).not.to.be.ok();
      expect(body.trim()).to.be(os.hostname());
      chain();
    });
  });

  it("should test failure", function(chain) {
    exec("node", ['-e', "console.error(22);process.exit(42);"], function(err, stdout, stderr) {
      expect(err).to.be(42);
      expect(stderr.trim()).to.eql(22);
      chain();
    });
  });

  it("should test wait", async function() {
    var process_1 = require('child_process').spawn('node', ['-e', 'process.exit(0)']);
    var result  = await wait(process_1);

    //wait doesn't return any stdout
    expect(result).to.be.undefinded;

    var process_2 = require('child_process').spawn('node', ['-e', 'process.exit(1)']);
    try {
      await wait(process_2);
    } catch(err) {
      expect(err).to.be("Invalid process exit code");
    }
  });

});
