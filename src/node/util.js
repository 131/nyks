var util   = require('util'),
    crypto = require('crypto');


util.md5 = function(str){
  return crypto.createHash('md5').update(str).digest('hex');
}
