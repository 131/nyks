"use strict";

var dayOfTheYear = require('mout/date/dayOfTheYear');

module.exports = function(date){
  var i = dayOfTheYear(date);
  var s = "winter";

  if(i < 356) // dec   21
    s = "autumn";
  if(i < 265) // sept  21
    s = "summer";
  if(i < 173) // june  21 
    s = "spring";
  if(i < 81)  // march 21 
    s = "winter";

  return s;
}
