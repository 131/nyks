"use strict";

const ALPHABET_RFC4648 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";


// base32 represent binary data, so extra / incompletes bytes are discarded

function decodeBase32(input, alphabet = ALPHABET_RFC4648) {
  const cleaned = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = "";
  for(let i = 0, val; i < cleaned.length; i++) {
    val = alphabet.indexOf(cleaned[i]);
    bits += val.toString(2).padStart(5, "0");
  }
  const length = Math.floor(bits.length / 8);
  const bytes = Buffer.alloc(length);
  for(let i = 0; i < length; i++)
    bytes[i] = parseInt(bits.substr(i * 8, 8), 2);

  return bytes;
}


module.exports = decodeBase32;

