"use strict";

/**
* from  crc32.js (C) 2014-2015 SheetJS -- http://sheetjs.com
*/

var use_buffer = typeof Buffer !== 'undefined';
var use_in32   = typeof Int32Array !== 'undefined';


var table = (function() {
  var c = 0, table = new Array(256);
  for(var n =0; n != 256; ++n) {
    c = n;
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    table[n] = c;
  }
  return use_in32 ? new Int32Array(table) : table;
})();



/* charCodeAt is the best approach for binary strings */

function crc32_bstr(bstr) {
  if(bstr.length > 32768) if(use_buffer) return crc32_buf_8(new Buffer(bstr));
  var crc = -1, L = bstr.length - 1;
  for(var i = 0; i < L;) {
    crc =  table[(crc ^ bstr.charCodeAt(i++)) & 0xFF] ^ (crc >>> 8);
    crc =  table[(crc ^ bstr.charCodeAt(i++)) & 0xFF] ^ (crc >>> 8);
  }
  if(i === L) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i)) & 0xFF];
  return crc ^ -1;
}


function crc32_buf(buf) {
  if(buf.length > 10000) return crc32_buf_8(buf);
  for(var crc = -1, i = 0, L=buf.length-3; i < L;) {
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
  }
  while(i < L+3) crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
  return crc ^ -1;
}


function crc32_buf_8(buf) {
  for(var crc = -1, i = 0, L=buf.length-7; i < L;) {
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
    crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
  }
  while(i < L+7) crc = (crc >>> 8) ^ table[(crc^buf[i++])&0xFF];
  return crc ^ -1;
}

/* much much faster to intertwine utf8 and crc */
function crc32_str(str) {
  for(var crc = -1, i = 0, L=str.length, c, d; i < L;) {
    c = str.charCodeAt(i++);
    if(c < 0x80) {
      crc = (crc >>> 8) ^ table[(crc ^ c) & 0xFF];
    } else if(c < 0x800) {
      crc = (crc >>> 8) ^ table[(crc ^ (192|((c>>6)&31))) & 0xFF];
      crc = (crc >>> 8) ^ table[(crc ^ (128|(c&63))) & 0xFF];
    } else if(c >= 0xD800 && c < 0xE000) {
      c = (c&1023)+64; d = str.charCodeAt(i++) & 1023;
      crc = (crc >>> 8) ^ table[(crc ^ (240|((c>>8)&7))) & 0xFF];
      crc = (crc >>> 8) ^ table[(crc ^ (128|((c>>2)&63))) & 0xFF];
      crc = (crc >>> 8) ^ table[(crc ^ (128|((d>>6)&15)|(c&3))) & 0xFF];
      crc = (crc >>> 8) ^ table[(crc ^ (128|(d&63))) & 0xFF];
    } else {
      crc = (crc >>> 8) ^ table[(crc ^ (224|((c>>12)&15))) & 0xFF];
      crc = (crc >>> 8) ^ table[(crc ^ (128|((c>>6)&63))) & 0xFF];
      crc = (crc >>> 8) ^ table[(crc ^ (128|(c&63))) & 0xFF];
    }
  }
  return crc ^ -1;
}



module.exports      = crc32_str;
module.exports.buf  = crc32_buf;
module.exports.bstr = crc32_bstr;