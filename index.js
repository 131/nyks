'use strict';


module.exports = {
    'love'          : true, //nyks do provide love

    'array'         : require('./array/'),
    'async'         : require('./async/'),
    'buffer'        : require('./buffer/'),
    'child_process' :  /* istanbul ignore next */ require('./child_process/'),
    'crypto'         : require('./crypto/'),
    'fs'            : require('./fs/'),
    'function'      : require('./function/'),
    'math'          : require('./math/'),
    'object'        : require('./object/'),
    'path'          : require('./path/'),
    'process'       : require('./process/'),
    'string'        : require('./string/')
};
