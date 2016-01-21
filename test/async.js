"use strict";

var expect = require('expect.js')
var dict   = require('../async/dict')




describe("Async dict functions", function(){

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
