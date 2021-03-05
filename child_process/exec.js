"use strict";

const {spawn} = require('child_process');
const wait  = require('./wait');
const drain = require('../stream/drain');

module.exports = async function(cmd, args = [], options = {}) {
  if(!Array.isArray(args))
    (options = args), (args = options.args || []);

  var child = spawn(cmd, args, options);

  let [stdout] = await Promise.all([drain(child.stdout), wait(child)]);

  return stdout;
};

