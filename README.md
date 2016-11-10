# Motivation

[nyks](https://github.com/131/nyks) is a modular nodejs utilities collection ([mout](https://github.com/mout/mout) completion for (mostly) nodejs patterns).
Module are exported in standard commonJS module format and written in pure ES5/ES6 strict format. (no transpilation required nor used).

Use browserify if you need nyks module in a browser environnement.

[![Build Status](https://travis-ci.org/131/nyks.svg?branch=master)](https://travis-ci.org/131/nyks)
[![Coverage Status](https://coveralls.io/repos/github/131/nyks/badge.svg?branch=master)](https://coveralls.io/github/131/nyks?branch=master)
[![Version](https://img.shields.io/npm/v/nyks.svg)](https://www.npmjs.com/package/nyks)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)


## Main goals

 - increase code reuse;
 - be clear (code should be clean/readable);
 - be easy to debug;
 - be easy to maintain;
 - follow best practices;
 - follow standards when possible;
 - **don't convert JavaScript into another language!**
 - be compatible with other frameworks;
 - be modular;
 - have unit tests for all modules;


## What shouldn't be here

 - Event system - pub/sub ; see [uclass/events](https://github.com/131/uclass) or [eventemitter-co](https://github.com/131/eventemitter-co)
 - Template engine;
 - Anything that isn't generic enough to be on a standard library;
 - Anything that could be a separate library and/or isn't a modular utility...


## API Documentation

Online documentation can be found inside the `doc` folder.

## License
Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

## Credits / related
* [131](https://github.com/131), author
* [mout](https://github.com/mout/mout), design inspiration, main complementarity
* [async-co](https://github.com/mout/mout), good complementarity
* [cnyks](https://github.com/131/cnyks), CLI runner & related tools
