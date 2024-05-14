"use strict";

const guid = require('mout/random/guid');

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

const startest = (domain, reg) => {

  const wildgui = guid().replace(new RegExp('-', 'g'), '');
  reg = reg.replace(new RegExp('\\*', 'g'), wildgui);
  reg = `^${escapeRegex(reg)}$`;
  reg = reg.replace(wildgui, '.*?');

  let tmp = new RegExp(reg);
  return tmp.test(domain);
};

module.exports = startest;
