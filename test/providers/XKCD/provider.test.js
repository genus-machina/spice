const MockConfig = require('../helpers/MockConfig');
const test = require('ava');
const XKCD = require('../../../src/providers/XKCD');

test.beforeEach((test) => {
  test.context.config = new MockConfig();
  test.context.config.set('state.dir', 'bogus');

  test.context.xkcd = new XKCD(test.context.config);
});

test('The provider has a name', async (test) => {
  test.is(test.context.xkcd.name, 'xkcd');
});
