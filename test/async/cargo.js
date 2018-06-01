"use strict";


const expect = require('expect.js');

const cargo = require('../../async/cargo');
const sleep = require('../../async/sleep');


describe('cargo', function() {

  it('basics', async function() {


    var traces = [];

    var worker = cargo(async (tasks) => {
      traces.push(...tasks);
      await sleep(500);
    }, 10);


    for(let i = 0; i < 15; i++)
      worker.push(i);

    await sleep(100);


    for(let i = 15; i < 18; i++)
      worker.push(i);




    expect(traces).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    await sleep(500);
    expect(traces).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);


  });

});
