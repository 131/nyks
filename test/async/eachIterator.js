"use strict";


const expect = require('expect.js');

const eachIteratorLimit       = require('../../async/eachIteratorLimit');

const sleep      = require('../../async/sleep');

describe("testing async iterators", function() {



  it('eachIteratorLimit', async function () {
    var args = [];
    var arr  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    var n = 0;

    var it = function *() {
      while(n < 10)
        yield n++;
    };
    var liste = it();
    await eachIteratorLimit(liste, 2, async function (x) {
      await sleep(x * 5);
      args.push(x);
    });

    expect(args).to.eql(arr);
  });

  it('eachIteratorLimit with iterator failure', async function () {
    var args = [];
    var n = 0;

    var it = function *() {
      while(n < 10) {
        if(n == 4)
          throw "Nope";
        yield n++;
      }
    };

    var liste = it();
    try {
      await eachIteratorLimit(liste, 2, async function (x) {
        await sleep(x * 5);
        args.push(x);
      });
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.eql("Nope");
      expect(args).to.eql([0, 1, 2]);

    }

  });

  it('eachIteratorLimit with thunk failure', async function () {
    var args = [];

    var n = 0;

    var it = function *() {
      while(n < 10)
        yield n++;
    };

    var liste = it();
    try {
      await eachIteratorLimit(liste, 2, async function (x) {
        if(x == 4)
          throw "Nope";
        await sleep(x * 5);
        args.push(x);
      });
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.eql("Nope");
      expect(args).to.eql([0, 1, 2]);

    }

  });


});
