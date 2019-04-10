"use strict";


const expect = require('expect.js');

const getSeason = require('../date/getSeason');
const strftime  = require('../date/strftime');
const humanDiff = require('../date/humanDiff');

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

    let tmp_string = strftime(date, '%v');

    //this fix for travis tests => Ignore all timezone informations...
    tmp_string = tmp_string.split(' GMT')[0];

    expect(strftime(date, '%d')).to.eql("01");
    expect(tmp_string).to.eql("Sun Dec 27 2015 00:00:00");
    expect(strftime(date, '%E')).to.eql("winter");
    expect(strftime(date, 'a%%ba')).to.eql("a%ba");
    expect(strftime(date, '%%')).to.eql("%");
    expect(strftime(date, '%g')).to.eql("%g"); //doesn't exist
  });


  it("should test humanDiff", function() {
    expect(humanDiff(0)).to.eql("0s");
    expect(humanDiff(1)).to.eql("1s");
    expect(humanDiff(3600)).to.eql("1h");
    expect(humanDiff(3601)).to.eql("1h 1s");
    expect(humanDiff(86400 * 365 + 11 * 3600)).to.eql("1y 5d"); //at 30days per month
  });


});
