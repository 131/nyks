"use strict";


const expect   =  require('expect.js');

const combine    = require('../object/combine');
const difference = require('../object/difference');
const indexOf    = require('../object/indexOf');
const jsonpath   = require('../object/jsonpath');
const jqpath     = require('../object/jqpath');
const jqdive     = require('../object/jqdive');
const mask       = require('../object/mask');
const sort       = require('../object/sort');
const dive       = require('../object/dive');

//I feel a little sorry for that
describe("object functions", function() {

  it("should test jqpath", function() {
    var obj = {
      "foo" : {
        "bar" : [
          {"color" : "blue"}
        ],
      },
      "" : "empty",
      " " : "empty",

      "-test" : {
        ".wi.th" : {
          "." : {
            "${nested}"  : {
              "[weird']" : ["stuffs"],
            }
          }
        }
      }
    };

    expect(jqpath(obj)).to.be(obj);
    expect(jqpath(obj, ".")).to.be(obj);
    expect(jqpath(obj, "nope")).to.be(undefined);
    expect(jqpath(obj, "......")).to.be(obj);
    expect(jqpath(obj, '.""')).to.be(obj['']);
    expect(jqpath(obj, '." "')).to.be(obj[' ']);
    expect(jqpath(obj, ".foo")).to.be(obj.foo);
    expect(jqpath(obj, ".foo.bar.0.color")).to.be("blue");
    expect(jqpath(obj, ".foo.bar.0.color")).to.be("blue");
    expect(jqpath(obj, '."-test"')).to.be(obj["-test"]);
    expect(jqpath(obj, '."-test".\'.wi.th\'."."."${nested}"."[weird\']".0')).to.be("stuffs");
    expect(jqpath(obj, '.["-test"].[\'.wi.th\'].["."].["${nested}"].["[weird\']"].["0"]')).to.be("stuffs");
  });


  it("should test dive", function() {
    var obj = {
      "foo" : {
        "bar" : [
          {"color" : "blue"}
        ],
      }
    };

    expect(dive(obj)).to.be(obj);
    expect(dive(null, "nope")).not.to.be.ok();
    expect(dive(undefined)).to.be(undefined);
    expect(dive(obj, "foo")).to.be(obj.foo);
    expect(dive(obj, null, "foo")).to.be(undefined);
    expect(dive(obj, "foo", "bar", 0, "color")).to.be("blue");
    expect(dive(obj, "foo", "bar", "0.color")).to.be("blue");
    expect(dive(obj, "foo", "bar", "0..color")).to.be(undefined);
    expect(dive(obj, "foo.bar.0.color")).to.be("blue");
    expect(dive(obj, "nope", "bar", 0, "color")).to.be(undefined);
    expect(dive(obj, "-")).to.be(undefined);
  });



  it("should test jqdive", function() {
    var obj = {
      "foo" : {
        "bar" : [
          {"color" : "blue"}
        ],
      }
    };

    expect(jqdive(obj)).to.be(obj);
    expect(jqdive(null, "nope")).not.to.be.ok();
    expect(jqdive(undefined)).to.be(undefined);
    expect(jqdive(obj, "foo")).to.be(obj.foo);
    expect(jqdive(obj, null, "foo")).to.be(undefined);
    expect(jqdive(obj, "foo", "bar", 0, "color")).to.be("blue");
    expect(jqdive(obj, "foo", "bar", "0.color")).to.be("blue");
    expect(jqdive(obj, "foo", "bar", "0..color")).to.be("blue");
    expect(jqdive(obj, "foo.bar.0.color")).to.be("blue");
    expect(jqdive(obj, "['foo'].bar['0'][\"color\"]")).to.be("blue");
    expect(jqdive(obj, "nope", "bar", 0, "color")).to.be(undefined);
    expect(jqdive(obj, "-")).to.be(undefined);
  });



  it("should test sort", function() {
    var keys = {
      "france" : "baguette",
      "italy"  : "pizza",
      "usa"    : "hamburger"
    };
    expect(sort(keys, ["france", "italy"])).to.eql({
      "france" : "baguette",
      "italy"  : "pizza"
    });
  });


  it("should test difference", function() {
    var obj1 = {a : 5, c : 2, d : "aa"};
    var obj2 = {b : 3, c : 2, d : "a"};

    expect(difference(obj1, obj2)).to.eql(["a", "b", "d"]);
  });



  it("should test indexOf", function() {
    var keys   = ["france", "italy", "usa"];
    var values = ["baguette", "pizza", "hamburger"];
    expect(indexOf(combine(keys, values), "pizza")).to.eql("italy");
    expect(indexOf(combine(keys, values), "melon")).to.eql(null);
  });

  it("should return empty object", function() {
    var values = ["baguette", "pizza", "hamburger"];
    expect(combine(null, values)).to.eql({});
  });


  it("should test mask", function() {
    var values = {
      "france" : "baguette",
      "italy"  : "pizza",
      "usa"    : "hamburger"
    };
    expect(mask(values, "In %s we eat %s", ". ")).to.eql("In france we eat baguette. In italy we eat pizza. In usa we eat hamburger");
  });


  it("should test jsonpath", function() {
    var values = {
      "france" : "baguette",
      "italy"  : {"food" : "pizza" },
      "usa"    : "hamburger"
    };

    expect(jsonpath(values, "/france")).to.be("baguette");
    expect(jsonpath(values, "/italy/food")).to.be("pizza");
    expect(jsonpath(values, "/italy/drink")).to.be(null);
  });

});
