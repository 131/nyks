"use strict";
/* eslint-env node,mocha */


const expect = require('expect.js');

const parse_cookie = require('../http/header/parse').parse_cookie;

describe("Testing header parse", function() {

  it("test lots of parsing", function() {
    var tests = [
      [
        'X-APPLE-WEBAUTH-LOGIN="v=1:t=IWONTTELL-K6prhxwpzG3DAT7w~";Path=/;Domain=.icloud.com;Secure; HttpOnly ',
        {
          name   : 'X-APPLE-WEBAUTH-LOGIN',
          value  : 'v=1:t=IWONTTELL-K6prhxwpzG3DAT7w~',
          extras : {
            path     : '/',
            domain   : '.icloud.com',
            secure   : null,
            httponly : null
          }
        }
      ]
    ];

    tests.forEach(function(test) {
      expect(parse_cookie(test[0])).to.eql(test[1]);
    });
  });

});
