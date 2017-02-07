"use strict";

const fs = require('fs');

const expect     = require('expect.js');
const tmppath    = require('../fs/tmppath');
const pipe = require('../stream/pipe');
const fromBuffer = require('../stream/fromBuffer');
const defer = require('../promise/defer');



describe("Stream functions", function(){



    it("should test pipe", function(done){

        var body = "café",
             buf = new Buffer(body);

        var input = fromBuffer(buf);

        var defered = defer();
        var dest = pipe(defered) ;
        input.pipe( dest );


        dest.on("finish", function(){

          defered.then(function(contents){
            expect("" + contents).to.eql(body);
            done();
          });


        });
    });

    it("should test fromBuffer", function(done){

        var body = "café",
             buf = new Buffer(body);

        var tmp_path = tmppath("too"),
             dest = fs.createWriteStream(tmp_path);

        var input = fromBuffer(buf);
        input.pipe(dest);

        dest.on("finish", function(){
          expect("" + fs.readFileSync(tmp_path)).to.eql(body);
          fs.unlinkSync(tmp_path);
          done();
        });
    });

});
