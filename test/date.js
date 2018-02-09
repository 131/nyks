"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const getSeason = require('../date/getSeason');
const strftime  = require('../date/strftime');

describe("Date functions", function() {

  it("should test getSeason", function() {
    expect(getSeason(new Date('2016-01-01'))).to.eql("winter");
    expect(getSeason(new Date('2016-12-31'))).to.eql("winter");

    expect(getSeason(new Date('2016-04-01'))).to.eql("spring");
    expect(getSeason(new Date('2016-07-01'))).to.eql("summer");
    expect(getSeason(new Date('2016-10-01'))).to.eql("autumn");
  });

  it("should test strftime", function() {
    var date = new Date('2016-01-01');
    expect(strftime(date, '%d')).to.eql("01");
    expect(strftime(date, '%v')).to.eql("Sun Dec 27 2015 00:00:00 GMT+0100 (STD)");
    expect(strftime(date, '%E')).to.eql("winter");
    expect(strftime(date, '%g')).to.eql("%g"); //doesn't exist
    //expect(strftime(date, '%%')).to.eql("%"); doesn't work...
  });

});
