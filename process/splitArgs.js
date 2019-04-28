"use strict";


const mask = "(\\s+)|--\\s+(.*)|([^\\s\\\"']+)|\\\"([^\\\"]*)\\\"|'([^']*)'";

module.exports = function(str) {
  var r = new RegExp(mask, "g");
  var args = [], i = 0;
  var step, sep, value, quoted;

  while((step = r.exec(str || ""))) {
    sep   = step[1] !== undefined;
    quoted = step[4] !== undefined || step[5] !== undefined;
    value = step[3] || step[4] || step[5] || "";

    // pass all after -- as non parsed
    if(step[2] !== undefined) {
      args.push("--", step[2]);
      break;
    }

    if(sep) {
      if(args.length)
        i++;
      continue;
    }

    //do not cast explicitly quoted strings
    if(value !== "" && isFinite(value) && !quoted)
      value = parseFloat(value);
    if(args[i])
      value = String(args[i]) + value;
    args[i] = value;
  }

  return args;

};
