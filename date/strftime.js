"use strict";

const getSeason = require('./getSeason');
const strftime  = require('mout/date/strftime');
const startOf   = require('mout/date/startOf');

module.exports = function(date, format) {
  format = strftime.apply(null, arguments);
  var reToken = /%([a-z%])/gi;

  function convertToken(date, token) {
    switch (token) {
      case 'E':
        return getSeason(date);
      case 'v':
        return startOf(date, 'week');
      default:
        // keep unrecognized tokens
        return '%' + token;
    }
  }

  return format.replace(reToken, function(match, token) { return convertToken(date, token); });
};
