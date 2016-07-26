"use strict";

const fs = require('fs');

const expect     = require('expect.js');
const tmppath    = require('../fs/tmppath');
const fromBuffer = require('../stream/fromBuffer');



describe("Stream functions", function(){


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
