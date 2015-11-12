"use strict";

var fs = require('fs');
var path = require('path');
var expect = require('expect.js')
var mkdirpSync= require('../fs/mkdirpSync')
var deleteFolderRecursive= require('../fs/deleteFolderRecursive')
var md5File= require('../fs/md5File')
var md5FileSync = require('../fs/md5FileSync')
var isFileSync = require('../fs/isFileSync')
var isDirectorySync = require('../fs/isDirectorySync')
var filemtimeSync = require('../fs/filemtimeSync')
var filesizeSync = require('../fs/filesizeSync')
var tmppath = require('../fs/tmppath')
var getFolderSize = require('../fs/getFolderSize')
var clearFolderReccurcive = require("../fs/clearFolderReccurcive")

var guid = require('mout/random/guid')


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

    it("should test filemtimeSync", function(){
      var file = "dummy";

      fs.writeFileSync(file, "bar");
      expect(filemtimeSync(file)).to.be.ok();
      fs.unlinkSync(file);
    });

    it("should test filesizeSync", function(){
      var file = "dummy";

      fs.writeFileSync(file, "bar");
      expect(filesizeSync(file)).to.be(3);
      fs.unlinkSync(file);
    });


    it("should test md5FileSync", function(){
      var file = "dummy";

      fs.writeFileSync(file, "bar");

      expect(isFileSync(file)).to.be.ok();
      expect(isDirectorySync(file)).not.to.be.ok();

      var hash = md5FileSync(file);
      expect(hash).to.be("37b51d194a7513e45b56f6524f2d51f2");
      fs.unlinkSync(file);

    });

    it("should test tmppath", function(){
      var tpath = tmppath("too"), tpath2 = tmppath(), tpath3 = tmppath("foo", false);
      fs.writeFileSync(tpath, "ping");
      fs.writeFileSync(tpath3, "ping");
      expect("" + fs.readFileSync(tpath)).to.be("ping");

      expect(fs.existsSync(tpath2)).not.to.be.ok();

      //fake exit event emit
      process.emit("fsgc");

      expect(fs.existsSync(tpath)).not.to.be.ok();
      expect(fs.existsSync(tpath3)).to.be.ok();
      fs.unlinkSync(tpath3);
    });

    it("should test folder size reccurcive", function(done){
      var root = "trashme";
      var size = 0 ;
      for (var i = 0; i < 4; i++) {
        var dir = path.join(root, guid().split('-').join('/'));
        mkdirpSync(dir);
        for (var j = 0; j < 4; j++) {
          var filepath = dir + '/' + guid();
          fs.writeFileSync(filepath, guid());
          size += filesizeSync(filepath);
        }
      }

      getFolderSize(root , function(err , foldersize){
        expect(foldersize).to.be(size);
        deleteFolderRecursive(root);
        done();
      })
    });


    it("should clear cache with time", function(done){
      var root = "trashme";

      var size = 0 ;
      for (var i = 0; i < 3; i++) {
        var dir = path.join(root, "first", guid().split('-').join('/'));
        mkdirpSync(dir);
        for (var j = 0; j < 3; j++) {
          var filepath = dir + '/' + guid();
          fs.writeFileSync(filepath, guid());
        }
      }

      setTimeout(function(){
        for (var i = 0; i < 3; i++) {
          var dir = path.join(root, "second", guid().split('-').join('/'));
          mkdirpSync(dir);
          for (var j = 0; j < 3; j++) {
            var filepath = dir + '/' + guid();
            fs.writeFileSync(filepath, guid());
            size += filesizeSync(filepath);
          }
        }

        clearFolderReccurcive(root, null, 100, function(){
          getFolderSize(root +"/first", function(err , foldersize){
            expect(foldersize).to.be(0);
            getFolderSize(root + "/second", function(err , foldersize){
              expect(foldersize).to.be(size);
              deleteFolderRecursive(root);
              done();
            })
          })
        })
      }, 200)

    });

    it("should clear cache with size", function(done){
      var root = "trashme";

      for (var i = 0; i < 3; i++) {
        var dir = path.join(root, "first", guid().split('-').join('/'));
        mkdirpSync(dir);
        for (var j = 0; j < 3; j++) {
          var filepath = dir + '/' + guid();
          fs.writeFileSync(filepath, guid());
        }
      }

      var size = 0;
      var dir = path.join(root, "second", guid().split('-').join('/'));
      mkdirpSync(dir);
      while(size < 2000){
        var filepath = dir + '/' + guid();
        fs.writeFileSync(filepath, guid());
        size += filesizeSync(filepath);
      }

      clearFolderReccurcive(root, 2000, null, function(){
        getFolderSize(root +"/first", function(err , foldersize){
          expect(foldersize).to.be(0);
          getFolderSize(root + "/second", function(err , foldersize){
            expect(foldersize).to.be(size);
            deleteFolderRecursive(root);
            done();
          })
        })
      })

    });


    it("should test tmppath stress", function(){
      //this create too many files for tmppath to handle, it swap to a bigger file length
      for(var b, a=0; a<100; a++) {
        b = tmppath("foo", true, 1);
        expect(fs.existsSync(b)).not.to.be.ok();
        fs.writeFileSync(b, "dummy");
      }
    });




});
