"use strict";


module.exports = function(str) {
  var mask      = "(\\s+)|--\\s+(.*)|([^\\s\\\"']+)|\\\"([^\\\"]*)\\\"|'([^']*)'";

  var args = [], need_value = true, digest = "";
  var r = new RegExp(mask, "g"), step, sep, value;

  while(step = r.exec(str) ) {

    sep   = step[1] !== undefined;
    value = step[3] || step[4] || step[5] || "";
    if(step[2] !== undefined) {
      args.push("--", step[2]);
      continue;
    }

          //check "value"/separator alternance
    if(sep) { need_value = true; continue; }
    if(!need_value) break; need_value = false;

    if(value !== "" && isFinite(value))
      value = parseFloat(value);

    args.push(value);
  }

  return args;

}
