"use strict";

const expect = require('expect.js');
const freeze = require('../object/freeze');

describe('object/freeze', function() {
  it('freezes nested objects and arrays without cloning', function() {
    const obj = {nested : {value : 1}, items : [{value : 2}]};
    expect(freeze(obj)).to.be(obj);
    for(const value of [obj, obj.nested, obj.items, obj.items[0]])
      expect(Object.isFrozen(value)).to.be(true);
    expect(() => { obj.nested.value = 3; }).to.throwException();
    expect(() => { obj.items.push({}); }).to.throwException();
    expect(() => { obj.extra = true; }).to.throwException();
    expect(() => { delete obj.nested; }).to.throwException();
  });

  it('returns null and primitive values unchanged', function() {
    for(const value of [null, undefined, false, true, 0, 'value', Symbol('value')])
      expect(freeze(value)).to.be(value);
  });

  it('preserves shared references and terminates on cycles', function() {
    const child = {value : 1};
    const obj = {first : child, second : child};
    obj.self = obj;
    child.parent = obj;
    expect(freeze(obj)).to.be(obj);
    expect(obj.first).to.be(obj.second);
    expect(obj.self).to.be(obj);
    expect(Object.isFrozen(child)).to.be(true);
    expect(freeze(obj)).to.be(obj);
  });

  it('visits children of a parent that was only shallow-frozen', function() {
    const child = {nested : {value : 1}};
    const obj = Object.freeze({child});
    freeze(obj);
    expect(Object.isFrozen(child)).to.be(true);
    expect(Object.isFrozen(child.nested)).to.be(true);
  });

  it('includes non-enumerable and symbol data properties', function() {
    const key = Symbol('key');
    const hidden = {value : 1};
    const obj = {[key] : {value : 2}};
    Object.defineProperty(obj, 'hidden', {value : hidden});
    freeze(obj);
    expect(Object.isFrozen(hidden)).to.be(true);
    expect(Object.isFrozen(obj[key])).to.be(true);
  });

  it('does not evaluate getters', function() {
    let calls = 0;
    const obj = {get computed() { calls++; throw new Error('Getter must not run'); }};
    freeze(obj);
    expect(calls).to.be(0);
    expect(Object.isFrozen(obj)).to.be(true);
  });

  it('does not freeze inherited data or global prototypes', function() {
    const prototype = {inherited : {value : 1}};
    const obj = Object.create(prototype);
    obj.own = {value : 2};
    freeze(obj);
    expect(Object.isFrozen(obj.own)).to.be(true);
    expect(Object.isFrozen(prototype)).to.be(false);
    expect(Object.isFrozen(prototype.inherited)).to.be(false);
    expect(Object.isFrozen(Object.prototype)).to.be(false);
  });

  it('freezes data attached to functions', function() {
    const fn = function() { return 1; };
    fn.settings = {value : 2};
    expect(freeze(fn)).to.be(fn);
    expect(fn()).to.be(1);
    expect(Object.isFrozen(fn.settings)).to.be(true);
    expect(Object.isFrozen(fn.prototype)).to.be(true);
  });
});
