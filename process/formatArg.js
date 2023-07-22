"use strict";

// credits : 131's dispatcher

const SCALAR = /^[a-zA-Z0-9_./:^,=-]+$/;

module.exports = function(value) {

  if(value === "" || value === null)
    return "\"\"";

  if(SCALAR.test(value))
    return value;

  /* eslint-disable-next-line */
  value = value.replace(new RegExp(`(\\\\*)"`), "$1\$&");
  value = value.replace(new RegExp(`^(.*\\s.*?)(\\\\*)$`), '"$1$2$2"');
  return value;
};


