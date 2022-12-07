"use strict";

// from https://nodejs.org/api/buffer.html#buftojson

module.exports =  (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
};

