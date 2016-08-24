"use strict";

var sprintf  = require('../string/format');
var repeat   = require('mout/string/repeat');
var truncate = require('nyks/string/truncate');

var LF = "\n";
var COLS       = 76;
var STR_PAD_LEFT  = "left";
var STR_PAD_RIGHT = "right";
var STR_PAD_BOTH  = "both";



var pad = function(str, pad, mode, mask, pad_len){
  if(!pad_len) pad_len = COLS;
  if(!mask)    mask    = '%s';
  if(!pad)     pad     = '─';
  if(!mode)    mode    = STR_PAD_BOTH;

  pad_len -= sprintf(mask, str).length;

  var left = (mode == STR_PAD_BOTH ) ? Math.floor(pad_len/2) : 0;

  return sprintf(mask,
      repeat(pad, Math.max(left, 0)) + str + repeat(pad, Math.max(pad_len - left, 0)));
}

var output = function(line){
  process.stderr.write(line);
}


var box = function(/*[title, msg]*/){
  var args = [].slice.call(arguments);
  if(!args.length)
    return;

  var dotrim = true, pad_len = COLS;

  for(var msg, a=1 ; a < args.length ; a+=2) {
    msg = args[a];
    if(typeof msg !== "string")
        msg = JSON.stringify(msg, null, 2);
    
    msg = msg.trim().replace("	", "    ").split(/\r?\n/);//use 4 tab indent

    msg.forEach(function(tmp_line, i) {
      if(dotrim)
        msg[i] = truncate(tmp_line,  COLS);
      //msg[i] = preg_replace('#&[^;]*?#m','…',);
      pad_len = Math.max(pad_len, msg[i].length + 2); //2 chars enclosure
    })
    args[a] = msg;
  }


  for(var a=0; a < args.length; a+=2) {
    output( pad(" "+args[a]+" ", "═", STR_PAD_BOTH, a ? "╠%s╣":"╔%s╗", pad_len) + LF );
    args[a+1].forEach(function(line) {
      output( pad(line, " ", STR_PAD_RIGHT, "║%s║", pad_len) + LF);
    });
  }
  output( pad('', "═", STR_PAD_BOTH, "╚%s╝", pad_len) + LF );
}



module.exports = box;
