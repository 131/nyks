"use strict";

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

});
