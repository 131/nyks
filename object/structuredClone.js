"use strict";

// good enough
module.exports = global.structuredClone || (obj => JSON.parse(JSON.stringify(obj)));
