"use strict";
"use strict";

var formatRegExp = /%[sdj%]/g;

module.exports= function(f) {
  var i = 1;
  var args = arguments;
  var len = args.length;

  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
    }
  });

  return str;
};
