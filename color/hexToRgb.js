"use strict";

module.exports = function(str) {
  var hex = String(str).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
  return (hex) ? hex.slice(1) : null;
};
