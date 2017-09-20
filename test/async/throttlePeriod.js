"use strict";

const assert = require('assert');
const expect = require('expect.js');
const sleep  = require('../../async/sleep');

const throttlePeriod  = require('../../async/throttlePeriod');
const each  = require('../../async/each');
const range  = require('mout/array/range');

const setImmediate = require('../../async/setImmediate');

describe('throttlePeriod', function(){

    this.timeout(10 * 1000);
  it('basics', async function() {

    var call_order = [];
    var delays = [40,20,60,20];


    var results = {}, a=0, b=0;

    var fn = async function (c) {
      results[a++] = c;
  
    }

    var p = throttlePeriod(fn, 1000);

    await each(range(1, 10), async function(){
      await p(b++);
    });



    expect(results).to.eql({0:0, 1: 9});


  });

  it('with no period', async function() {

    var call_order = [];
    var delays = [40,20,60,20];


    var results = {}, a=0, b=0;

    var d=0;
    var fn = async function (c) {
      d++;
      results[a++] = c;
  
    }

    var p = throttlePeriod(fn);


    setImmediate(function(){
      d++;
    });

    await each(range(1, 10), async function(){
      await p(b++);
    });


    expect(results).to.eql({0:0, 1: 9});


  });



});

