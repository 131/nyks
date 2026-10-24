"use strict";

const expect = require('expect.js');
const freeze = require('../object/freeze');

describe('object/freeze', function() {
  it('freezes nested objects and arrays without cloning', function() {
    const obj = {nested : {value : 1}, items : [{value : 2}]};
    expect(freeze(obj)).to.be(obj);
    [obj, obj.nested, obj.items, obj.items[0]].forEach(value => expect(Object.isFrozen(value)).to.be(true));
    expect(() => { obj.nested.value = 3; }).to.throwException();
    expect(() => { obj.items.push({}); }).to.throwException();
    expect(() => { obj.extra = true; }).to.throwException();
    expect(() => { delete obj.nested; }).to.throwException();
  });

  it('returns null and primitive values unchanged', function() {
    [null, undefined, false, true, 0, 'value', Symbol('value')].forEach(value => expect(freeze(value)).to.be(value));
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

  it('returns an already frozen object unchanged', function() {
    const obj = Object.freeze({value : 1});
    expect(freeze(obj)).to.be(obj);
  });
});
