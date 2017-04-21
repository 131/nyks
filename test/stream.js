"use strict";

const fs = require('fs');

const expect     = require('expect.js');
const tmppath    = require('../fs/tmppath');
const pipe = require('../stream/pipe');
const drain = require('../stream/drain');
const fromBuffer = require('../stream/fromBuffer');
const defer = require('../promise/defer');



describe("Stream functions", function(){


    it("should test drain", function(done){

        var body = "café",
             buf = new Buffer(body);

        var input = fromBuffer(buf);

        drain(input).then(function(contents){
          expect("" + contents).to.eql(body);
          done();
        });
    });

    it("should test drain (from a promise)", function(done){

        var body = "café",
             buf = new Buffer(body);

        var input = Promise.resolve(fromBuffer(buf));

        drain(input).then(function(contents){
          expect("" + contents).to.eql(body);
          done();
        });
    });




    it("should test pipe", function(done){

        var body = "café",
             buf = new Buffer(body);

        var tmp_path = tmppath("too");
        var dest = fs.createWriteStream(tmp_path);

        var input = fromBuffer(buf);
        pipe(input, dest).then( function() {
          expect("" + fs.readFileSync(tmp_path)).to.eql(body);
          fs.unlinkSync(tmp_path);
          done();
        }).catch(function(err){
          console.log(err);
        });
    });


    it("should test pipe", function(done){

        var body = "café",
             buf = new Buffer(body);

        var tmp_path = tmppath("too");

        var input = new Promise(function(resolve, reject){
          resolve(fromBuffer(buf));
        });

        var dest = new Promise(function(resolve, reject){
          resolve(fs.createWriteStream(tmp_path));
        });

        pipe(input, dest).then( function() {
          expect("" + fs.readFileSync(tmp_path)).to.eql(body);
          fs.unlinkSync(tmp_path);
          done();
        }).catch(function(err){
          console.log(err);
        });
    });

});
