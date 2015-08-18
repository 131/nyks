"use strict";

var fs = require('fs');
var path = require('path');
var expect = require('expect.js')
var mkdirpSync= require('../fs/mkdirpSync')
var deleteFolderRecursive= require('../fs/deleteFolderRecursive')
var md5File= require('../fs/md5File')
var isFileSync = require('../fs/isFileSync')
var isDirectorySync = require('../fs/isDirectorySync')





describe("FS functions", function(){


    it("should test mkdirpSync/deleteFolderRecursive", function(){
      var root = "trashme", dir = path.join(root, "this is/a/dir"), file = path.join(dir,"foo");
      var out = mkdirpSync(dir);
      expect(out).to.be(dir);

      expect(fs.existsSync(dir)).to.be.ok();

        deleteFolderRecursive(dir);
      expect(fs.existsSync(dir)).not.to.be.ok();

      deleteFolderRecursive(dir); //check delete a non existing path


      mkdirpSync(dir);
      mkdirpSync(dir);

      expect(isDirectorySync(dir)).to.be.ok();


      fs.writeFileSync(file, "bar");

      deleteFolderRecursive(root); 
      expect(isDirectorySync(root)).not.to.be.ok();

      expect(fs.existsSync(root)).not.to.be.ok();


    });

    it("should test md5File", function(done){
      var file = "dummy";

      fs.writeFileSync(file, "bar");

      expect(isFileSync(file)).to.be.ok();
      expect(isDirectorySync(file)).not.to.be.ok();



      md5File(file, function(err, hash){
        expect(hash).to.be("37b51d194a7513e45b56f6524f2d51f2");

        fs.unlinkSync(file);


        expect(isFileSync(file)).not.to.be.ok();
        expect(isDirectorySync(file)).not.to.be.ok();

        done();
      });



    });




});
