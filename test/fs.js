"use strict";


const expect = require('expect.js');

const fs     = require('fs');
const path   = require('path');

const glob   = require('glob').sync;

const copyFile              = require('../fs/copyFile');
const copyFiles             = require('../fs/copyFiles');
const deleteFolderRecursive = require('../fs/deleteFolderRecursive');
const filemtimeSync         = require('../fs/filemtimeSync');
const filesizeSync          = require('../fs/filesizeSync');
const isDirectorySync       = require('../fs/isDirectorySync');
const isFileSync            = require('../fs/isFileSync');
const json                  = require('../fs/JSON');
const md5File               = require('../fs/md5File');
const md5FileSync           = require('../fs/md5FileSync');
const mkdirpSync            = require('../fs/mkdirpSync');
const patchJSON             = require('../fs/patchJSON');
const readFileJSONSync      = require('../fs/readFileJSONSync');
const rmrf                  = require('../fs/rmrf');
const sha1File              = require('../fs/sha1File');
const tmppath               = require('../fs/tmppath');
const writeLazySafeSync     = require('../fs/writeLazySafeSync');
const createWriteStream     = require('../fs/createWriteStream');
const rename                = require('../fs/rename');
const readdir               = require('../fs/readdir');
const hashFile              = require('../fs/hashFile');

describe("FS functions", function() {

  it("should test readdir", async function() {
    var files = [];
    var foo = glob("test/**", {nodir : true, dot : true});

    for(var entry of readdir("test"))
      files.push(entry);

    files.sort();
    foo.sort();
    files = files.map(path.normalize);
    foo   = foo.map(path.normalize);
    expect(foo).to.eql(files);

  });

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

  it("should test createWriteStream", async function() {
    try {
      let dst = await createWriteStream("this/path/does/not/exists");
      dst.write("ok");
      throw "Never here";
    } catch(err) {
      expect(err.code).to.eql('ENOENT');
    }

    let tmp = tmppath();
    let dst = await createWriteStream(tmp);
    expect(dst.fd).to.be.ok();
  });

  it("should test rename", async function() {
    let src_path = tmppath();
    fs.createWriteStream(src_path); //leave it open..
    await rename(src_path, src_path + "after");
    expect(fs.existsSync(src_path + "after")).to.be.ok();
  });

  it("should test copyFiles", async function() {
    var TOP_CONTENT = 'THIS IS TOP FILE CONTENT';
    var target_dir  = 'target_copyfiles';
    var pattern     = 'fs/**';
    var process     = function(content) {
      return TOP_CONTENT + content;
    };

    var files       = glob(pattern);

    copyFiles(files, target_dir);

    var new_files = glob(pattern, {cwd : target_dir});

    expect(files).to.eql(new_files);

    await rmrf(target_dir);

    // test with only one file
    var file_path = 'fs/copyFiles.js';
    copyFiles(file_path, target_dir);

    new_files = glob(pattern, {cwd : target_dir, nodir : true});

    expect(new_files.length).to.be(1);
    expect(new_files[0]).to.be(file_path);

    await rmrf(target_dir);

    // now with path Callback
    var file_content = '' + fs.readFileSync(file_path);

    copyFiles(file_path, target_dir, {process});

    new_files = glob(pattern, {cwd : target_dir, nodir : true});

    var new_file_content = fs.readFileSync(path.join(target_dir, file_path), 'utf-8');

    expect(new_files.length).to.be(1);
    expect(new_files[0]).to.be(file_path);
    expect(new_file_content).to.be(TOP_CONTENT + file_content);

    await rmrf(target_dir);
  });

  it("should test mkdirpSync/deleteFolderRecursive", function() {
    var root = "trashme";
    var dir  = path.join(root, "this is/a/dir");
    var file = path.join(dir, "foo");
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
    var file = path.join(dir, "foo");
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


  it("should test hashFile", function(done) {
    var file = "test/rsrcs/empty";

    hashFile(file, ["md5", "sha1", "sha256"], function(err, hashes) {
      expect(hashes).to.eql({
        "md5" : "d41d8cd98f00b204e9800998ecf8427e",
        "sha1" : "da39a3ee5e6b4b0d3255bfef95601890afd80709",
        "sha256" : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      });

      done();
    });
  });

  it("should test hashFile (2)", function(done) {
    var file = "test/rsrcs/null";

    hashFile(file, ["sha256"], function(err, hashes) {
      expect(hashes).to.eql({
        "sha256" : "6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d"
      });
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

  it("should test patchJSON AND JSON AND readFileJSONSync", function() {
    var target = 'package_tmp.json';
    var src    = 'package.json';
    var concat = ' Patched';

    var previous_name = null;

    patchJSON(target, function(body) {
      previous_name = body.name;
      body.name = body.name + concat;
    }, src);

    var new_file_content = json(target);
    expect(new_file_content.name).to.be(previous_name + concat);

    // test with only one file
    var new_name = 'This is new name';
    patchJSON(target, function() {
      return {name : new_name};
    });

    new_file_content = readFileJSONSync(target);
    expect(new_file_content).to.eql({name : new_name});

    // cleanup
    fs.unlinkSync(target);
  });

  it("should test sha1File", function() {
    var file = "dummy";

    fs.writeFileSync(file, "bar");

    sha1File(file, function(err, sha1) {
      expect(err).to.be(null);
      expect(sha1).to.be('62cdb7020ff920e5aa642c3d4066950dd1f01f4d');

      fs.unlinkSync(file);
    });
  });

});
