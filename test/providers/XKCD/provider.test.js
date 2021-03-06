const test = require('ava');
const XKCD = require('../../../src/providers/XKCD');

const { setupProviderTest } = require('../helpers/providers');

const { testProviderInterface } = setupProviderTest({
  factory: (config) => new XKCD(config),
  test
});

testProviderInterface('xkcd');
