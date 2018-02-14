"use strict";

const os = require('os');

module.exports = function() {
  return os.platform() == "linux" && /microsoft/i.test(os.release());
};
