"use strict";


const expect = require('expect.js');
const os     = require('os');
const {spawn} = require('child_process');


const exec     = require('../child_process/exec');
const passthru = require('../child_process/passthru');
const wait     = require('../child_process/wait');

describe("Child process functions", function() {
  this.timeout(10 * 1000);
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

  it("should test exec", async () => {
    let body = String(await exec("hostname"));
    expect(body.trim()).to.be(os.hostname());

    let FOO = "okay";
    body = String(await exec(process.execPath, {env : {FOO}, args : ['-p', 'process.env.FOO']}));
    expect(body.trim()).to.be(FOO);

    body = String(await exec("hostname", {}));
    expect(body.trim()).to.be(os.hostname());
  });

  it("should test failure", async () => {
    try {
      await exec("node", ['-e', "console.error(22);process.exit(42);"]);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.match(/Invalid process exit code/);
    }
  });

  it("should test wait", async () => {
    var process_1 = spawn('node', ['-e', 'process.exit(0)']);
    var result  = await wait(process_1);

    //wait doesn't return any stdout
    expect(result).to.be.undefinded;

    var process_2 = spawn('node', ['-e', 'process.exit(1)']);
    try {
      await wait(process_2);
    } catch(err) {
      expect(err).to.be("Invalid process exit code");
    }
  });

});
