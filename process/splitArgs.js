"use strict";


module.exports = function(str) {
  var mask      = "(\\s+)|([^\\s\\\"']+)|\\\"([^\\\"]*)\\\"|'([^']*)'";

  var args = [], need_value = true, digest = "";
  var r = new RegExp(mask, "g"), step, sep, value;

  while(step = r.exec(str) ){
    sep   = step[1] !== undefined;
    value = step[2] || step[3] || step[4] || "";

          //check "value"/separator alternance
    if(sep) { need_value = true; continue; }
    if(!need_value) break; need_value = false;

    if(value !== "" && isFinite(value))
      value = parseFloat(value);

    args.push(value);
  }
  return args;

}
