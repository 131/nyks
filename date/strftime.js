"use strict";

var getSeason = require('./getSeason');
var strftime  = require('mout/date/strftime');
var startOf   = require('mout/date/startOf');

module.exports = function(date, format) {
  format = strftime.apply(null, arguments);
  var reToken = /%([a-z%])/gi;

  function convertToken(date, token, l10n){
      switch (token){
          case 'E':
              return getSeason(date);
          case 'v' : 
              return startOf(date, 'week');
          case '%':
              return '%';
          default:
              // keep unrecognized tokens
              return '%'+ token;
      }
  }

  return format
        .replace(reToken, function(match, token){ return convertToken(date, token); });
}