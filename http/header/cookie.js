"use strict";

  var name = Object.keys(cookie)[0];
  jar [name] = {value : cookie[name], extras : cookie };
  delete cookie[name];
