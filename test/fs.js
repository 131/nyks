"use strict";

var fs = require('fs');
var path = require('path');
var expect = require('expect.js')
var mkdirpSync= require('../fs/mkdirpSync')
var deleteFolderRecursive= require('../fs/deleteFolderRecursive')




describe("FS functions", function(){

    it("should test mkdirpSync", function(){
      var root = "trashme", dir = path.join(root, "this is/a/dir"), file = path.join(dir,"foo");
      var out = mkdirpSync(dir);
      expect(out).to.be(dir);

      expect(fs.existsSync(dir)).to.be.ok();

        deleteFolderRecursive(dir);
      expect(fs.existsSync(dir)).not.to.be.ok();

      deleteFolderRecursive(dir); //check delete a non existing path


      mkdirpSync(dir);
      fs.writeFileSync(file, "bar");

      deleteFolderRecursive(root);
      expect(fs.existsSync(root)).not.to.be.ok();


    });


});
