"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const queue = require('../../async/queue');

const sleep = require('../../async/sleep');

describe('queue', function() {

  it('basics', async function() {
    var call_order = [];
    var delays     = [40, 20, 60, 20];

    // worker1: --1-4
    // worker2: -2---3
    // order of completion: 2,1,4,3

    var q = queue(async function (task) {
      await sleep(delays.shift());
      call_order.push('process ' + task);
      return Promise.resolve('arg');
    }, 2);

    await Promise.all([
      (async function() {
        var arg = await q.push(1);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 1);
      }()), (async function() {
        var arg = await q.push(2);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 2);
      }()), (async function() {
        var arg = await q.push(3);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 3);
      }()), (async function() {
        var arg = await q.push(4);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 4);
      }())
    ]);

    expect(call_order).to.eql([
      'process 2', 'callback 2',
      'process 1', 'callback 1',
      'process 4', 'callback 4',
      'process 3', 'callback 3'
    ]);
  });

  it('default concurrency', async function() {
    var call_order = [];
    var delays     = [40, 20, 60, 20];

    // worker1: --1-4
    // worker2: -2---3
    // order of completion: 2,1,4,3

    var q = queue(async function (task) {
      await sleep(delays.shift());
      call_order.push('process ' + task);
      return Promise.resolve('arg');
    }, 1);

    await Promise.all([
      (async function() {
        var arg = await q.push(1);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 1);
      }()), (async function() {
        var arg = await q.push(2);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 2);
      }()), (async function() {
        var arg = await q.push(3);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 3);
      }()), (async function() {
        var arg = await q.push(4);
        expect(arg).to.equal('arg');
        call_order.push('callback ' + 4);
      }())
    ]);

    expect(call_order).to.eql([
      'process 1', 'callback 1',
      'process 2', 'callback 2',
      'process 3', 'callback 3',
      'process 4', 'callback 4',
    ]);
  });


  it('error propagation', async function () {
    var results = [];
    var q       = queue(async function(task) {
      if(task.name === 'foo')
        throw 'fooError';
    }, 2);

    await Promise.all([
      (async function () {
        await q.push({name : 'bar'});
        results.push('bar');
      }()), (async function () {
        await q.push({name : 'bur'});
        results.push('bur');
      }()), (async function () {
        try {
          await q.push({name : 'foo'});
        } catch(err) {
          results.push(err);
          return;
        }
        results.push('foo');
      }())
    ]);

    expect(results).to.eql(['bar', 'bur', 'fooError']);
  });

  it("test drain", async function() {

    var timeline = [];
    var q = queue(async function (time) {
      timeline.push(time);
      return await sleep(time);
    }, 1);

    q.push(1000);
    q.push(1000);
    q.push(1000);

    // cleanup tasks list
    q.drain();

    await q.push(100);

    expect(timeline).to.eql([1000, 100]); // with a latence of 50 ms.
  });

});
