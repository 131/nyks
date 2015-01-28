var fs = require('fs');
var path = require('path');


path.which = function(bin){
  var binpath, paths = process.env.PATH.split(path.delimiter);
  for(var i = 0; i <paths.length; i++) {
    var full = [path.join(paths[i], bin), path.join(paths[i], bin +".exe")];

    if(fs.existsSync(full[0]))
      return full[0];

    if(fs.existsSync(full[1]))
      return full[1];

  };
  return bin;
};
