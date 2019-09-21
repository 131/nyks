"use strict";


const expect   = require('expect.js');
const retryUntil = require('../../async/retryUntil');

describe('testing retryUntil', function() {
  this.timeout(20 * 1000);

  it('basics', async function() {
    let i = 0, start = Date.now();
    await retryUntil(() => (i++, i > 5), 600, 20);
    let took = Date.now() - start;
    expect(i).to.eql(6);
    expect(took).to.be.within(5 * 20, 600);
  });

  it('should test failure', async function() {
    let i = 0;
    try {
      await retryUntil(() => (i++, i > 10), 600, 200);
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.eql('Timeout');
    }
  });

  it('should test failure with specific message', async function() {
    let i = 0;
    try {
      await retryUntil(() => (i++, i > 10), 600, 200, 'Nada');
      expect().to.fail("Never here");
    } catch(err) {
      expect(err).to.eql('Nada');
    }
  });

});
