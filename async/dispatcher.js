"use strict";

module.exports = function(workers_props){

  var workers = [];
  workers_props.forEach(function(prop) {
    workers.push({idle:true, prop});
  });

  return {
    length : workers.length,

    pick : function(){
      for(var i = 0;i<workers.length; i++) {
        if(workers[i].idle) {
          workers[i].idle = false;
          return workers[i].prop;
        }
      }
      throw "No available worker found, did you set concurrency properly";
    },

    free : function(worker){
      for(var i = 0;i<workers.length; i++) {
        if(workers[i].prop === worker && workers[i].idle === false) {
          workers[i].idle = true;
          return;
        }
      }
      throw "Could not set worker free";
    }
  };
}
