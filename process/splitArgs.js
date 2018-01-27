"use strict";


const mask = "(\\s+)|--\\s+(.*)|([^\\s\\\"']+)|\\\"([^\\\"]*)\\\"|'([^']*)'";

module.exports = function(str) {

  var r = new RegExp(mask, "g");
  var args = [];
  var need_value = true;
  var step;
  var sep;
  var value;
  var quoted;

  while((step = r.exec(str))) {

    sep   = step[1] !== undefined;
    quoted = step[4] !== undefined || step[5] !== undefined;
    value = step[3] || step[4] || step[5] || "";
    if(step[2] !== undefined) {
      args.push("--", step[2]);
      continue;
    }

    //check "value"/separator alternance
    if(sep) {
      need_value = true;
      continue;
    }
    if(!need_value)
      break;
    need_value = false;

    //do not cast explicitly quoted strings
    if(value !== "" && isFinite(value) && !quoted)
      value = parseFloat(value);

    args.push(value);
  }

  return args;

};
