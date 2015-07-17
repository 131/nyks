module.exports = function(str, chunkSize){
  var chunks = []; chunkSize = chunkSize || 1;
  while (str) {
    if (str.length < chunkSize) {
        chunks.push(str);
        break;
    }
    else {
        chunks.push(str.substr(0, chunkSize));
        str = str.substr(chunkSize);
    }
  }
  return chunks;

}

