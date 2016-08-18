"use strict";

var expect = require('expect.js')
var dict   = require('../async/dict')

var throttle = require('../async/throttle');


describe("Async dict functions", function(){

  it("should test throttle", function(done){
    var step_clock = Date.now(), start = step_clock;

    var i = setInterval(function(){
      step_clock = Date.now();
    }, 10);

      //slow clock reader read time instantly, but takes 100ms to respond
    var SlowClockReader = function(nop, chain){
      var time = step_clock;
      setTimeout(function(){
        chain(null, time);
      }, 100);
    }

    //SlowClockReader = throttle(SlowClockReader, 2);


    SlowClockReader(null, function(err, time){ expect(time - start).to.be(0) });
    SlowClockReader(null, function(err, time){ expect(time - start).to.be(0) });
    SlowClockReader(null, function(err, time){ expect(time - start).to.be(0) });
    SlowClockReader(null, function(err, time){ expect(time - start).to.be(0) });

    SlowClockReader = throttle(SlowClockReader, 2); //now throttling

    SlowClockReader(null, function(err, time){ expect(Math.floor((time - start) / 100)).to.be(0) });
    SlowClockReader(null, function(err, time){ expect(Math.floor((time - start) / 100)).to.be(0) });
    SlowClockReader(null, function(err, time){ expect(Math.floor((time - start) / 100)).to.be(1) });
    SlowClockReader(null, function(err, time){ expect(Math.floor((time - start) / 100)).to.be(1) });
    SlowClockReader(null, function(err, time){ expect(Math.floor((time - start) / 100)).to.be(2) });

    setTimeout(function(){
      clearInterval(i);
      done();
    }, 300);
  });


  it("Should test async", function(done){
    var range = [1,2,3,4,5];
    dict(range, function(value, chain){
      setTimeout(function(){
        chain(null , value * 2);
      }, range * 10);
    }, function(err, results){
      expect(err).not.to.be.ok();
      expect(results).to.eql({
        1 : 2,
        2 : 4,
        3 : 6,
        4 : 8,
        5 : 10,
      });
      done();
    });
  });

  it("Should test async errors", function(done){
    var range = [1,2,3,4,5];
    dict(range, function(value, chain){
      setTimeout(function(){
        chain(value == 2 ? "nopenope" : null , value * 2);
      }, range * 10);
    }, function(err, results){
      expect(err).to.eql([ 'nopenope' ]);
      expect(results).to.eql({
        1 : 2,
        2 : null,
        3 : 6,
        4 : 8,
        5 : 10,
      });
      done();
    });
  });

});
