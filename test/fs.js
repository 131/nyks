"use strict";

/* global it describe */

const expect = require('expect.js');

const fs     = require('fs');
const path   = require('path');

const copyFile              = require('../fs/copyFile');
const deleteFolderRecursive = require('../fs/deleteFolderRecursive');
const filemtimeSync         = require('../fs/filemtimeSync');
const filesizeSync          = require('../fs/filesizeSync');
const isDirectorySync       = require('../fs/isDirectorySync');
const isFileSync            = require('../fs/isFileSync');
//const json                  = require('../fs/JSON');
const md5File               = require('../fs/md5File');
const md5FileSync           = require('../fs/md5FileSync');
const mkdirpSync            = require('../fs/mkdirpSync');
//const patchJSON             = require('../fs/patchJSON');
//const readFileJSONSync      = require('../fs/readFileJSONSync');
const rmrf                  = require('../fs/rmrf');
//const sha1File              = require('../fs/sha1File');
const tmppath               = require('../fs/tmppath');
const writeLazySafeSync     = require('../fs/writeLazySafeSync');

describe("FS functions", function() {

  it("should test copyFile", function(done) {
    var dst  = tmppath("too");
    var from = fs.readFileSync(__filename);
    var challenge;

    copyFile(__filename, dst, function(err) {
      expect(err).not.to.be.ok();
      challenge = fs.readFileSync(dst);
      expect("" + challenge).to.equal("" + from);
      fs.unlinkSync(dst);
      done();
    });
  });

  it("should test mkdirpSync/deleteFolderRecursive", function() {
    var root = "trashme";
    var dir  = path.join(root, "this is/a/dir");
    var file = path.join(dir,"foo");
    var out  = mkdirpSync(dir);

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

  it("should test rmrf", async function() {
    var root = "trashme";
    var dir  = path.join(root, "this is/a/dir");
    var file = path.join(dir,"foo");
    var out  = mkdirpSync(dir);

    expect(out).to.be(dir);

    expect(fs.existsSync(dir)).to.be.ok();

    await rmrf(dir);
    expect(fs.existsSync(dir)).not.to.be.ok();

    await rmrf(dir); //check delete a non existing path

    mkdirpSync(dir);
    mkdirpSync(dir);

    expect(isDirectorySync(dir)).to.be.ok();

    fs.writeFileSync(file, "bar");

    await rmrf(root);

    expect(isDirectorySync(root)).not.to.be.ok();
    expect(fs.existsSync(root)).not.to.be.ok();
  });

  it("should test md5File", function(done) {
    var file = "dummy";

    fs.writeFileSync(file, "bar");

    expect(isFileSync(file)).to.be.ok();
    expect(isDirectorySync(file)).not.to.be.ok();

    md5File(file, function(err, hash) {
      expect(hash).to.be("37b51d194a7513e45b56f6524f2d51f2");

      fs.unlinkSync(file);

      expect(isFileSync(file)).not.to.be.ok();
      expect(isDirectorySync(file)).not.to.be.ok();

      done();
    });
  });

  it("should test filemtimeSync", function() {
    var file = "dummy";

    fs.writeFileSync(file, "bar");
    expect(filemtimeSync(file)).to.be.ok();
    fs.unlinkSync(file);
  });

  it("should test filesizeSync", function() {
    var file = "dummy";

    fs.writeFileSync(file, "bar");
    expect(filesizeSync(file)).to.be(3);
    fs.unlinkSync(file);
  });

  it("should test md5FileSync", function() {
    var file = "dummy";

    fs.writeFileSync(file, "bar");

    expect(isFileSync(file)).to.be.ok();
    expect(isDirectorySync(file)).not.to.be.ok();

    var hash = md5FileSync(file);
    expect(hash).to.be("37b51d194a7513e45b56f6524f2d51f2");
    fs.unlinkSync(file);
  });

  it("should test tmppath", function() {
    var tpath  = tmppath("too");
    var tpath2 = tmppath();
    var tpath3 = tmppath("foo", false);

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

  it("should test tmppath stress", function() {
    //this create too many files for tmppath to handle, it swap to a bigger file length
    for(var b, a = 0; a < 100; a++) {
      b = tmppath("foo", true, 1);
      expect(fs.existsSync(b)).not.to.be.ok();
      fs.writeFileSync(b, "dummy");
    }
  });

  it("should test writeLazySafeSync", function(done) {
    var target = 'test/path/to/tash/me';
    var str    = `some 
    text
    to
    ${Date.now()}
    write
    `;
    var once = writeLazySafeSync(target, str);
    expect(once).to.be.ok();
    fs.writeFileSync(target, 'nope'); //alter file
    var twice = writeLazySafeSync(target, str);
    expect(twice).to.be.ok();

    expect(fs.existsSync(target + 'tmp')).to.be(false);
    //var fileStats = fs.statSync(target);
    setTimeout(() => {
      writeLazySafeSync(target, str);
      expect(fs.existsSync(target + 'tmp')).to.be(false);

      expect(fs.readFileSync(target, 'utf-8')).to.eql(str);
      fs.unlinkSync(target);
      done();
    }, 1000);
  });

});
