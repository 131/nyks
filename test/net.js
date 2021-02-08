"use strict";

const os = require('os');
const net = require('net');
const expect         = require('expect.js');

const getPort       = require('../net/getPort');
const randInt       = require('mout/random/randInt');


const host  = '127.0.0.1';

const IS_WSL = os.platform() == 'linux' && /microsoft/i.test(os.release());

let runner = describe;
if(IS_WSL)
  runner = describe.skip;

runner("net (getPort) functions", function() {
  this.timeout(60 * 1000);

  it("should get a free port in a range", async function() {
    let ports = [1025,  1025 + 20];

    let srv = {};
    for(let i = ports[0]; i <= ports[1]; i++) {
      srv[i] = await new Promise((resolve) => {
        let server = net.createServer().once('listening', () => resolve(server)).listen(i, host);
      });
    }

    let guess = randInt(...ports);
    srv[guess].close();
    let port = await getPort(...ports);
    expect(port).to.eql(guess);
    for(let i = ports[0]; i <= ports[1]; i++)
      srv[i].close();

  });

  it("should fail when no available port", async function() {
    let ports = [1025,  1025 + 20];

    let srv = {};
    for(let i = ports[0]; i <= ports[1]; i++) {
      srv[i] = await new Promise((resolve) => {
        let server = net.createServer().once('listening', () => resolve(server)).listen(i, host);
      });
    }

    try {
      let port = await getPort(...ports);
      throw `Got port ${port}`;
    } catch(err) {
      expect(err).to.match(/No available port/);
    }

    for(let i = ports[0]; i <= ports[1]; i++)
      srv[i].close();
  });


  it("should give an available port on zero", async function() {
    let port = await getPort();
    expect(port).to.be.ok();

    port = await getPort([0], null, '127.0.0.1');
    expect(port).to.be.ok();
  });



});
