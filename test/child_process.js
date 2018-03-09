"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');
const os     = require('os');

const exec     = require('../child_process/exec');
const passthru = require('../child_process/passthru');
const wait     = require('../child_process/wait');

describe("Child process functions", function() {

  it("should test passthru", function(chain) {
    passthru("hostname", function(err, exit) {
      expect(exit).to.be(0);
      chain();
    });
  });

  it("should test a failure", function(chain) {
    passthru("hostnameNope", {}, function(err) {
      expect(err).to.be.ok();
      chain();
    });
  });

  it("should passthru failure", function(chain) {
    passthru("node", ['-e', 'process.exit(33)'], function(err, exit) {
      expect(err).to.be("Bad exit code 33");
      expect(exit).to.be(33);
      chain();
    });
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
