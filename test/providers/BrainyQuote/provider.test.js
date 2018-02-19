const BrainyQuote = require('../../../src/providers/BrainyQuote');
const test = require('ava');

const { setupProviderTest } = require('../helpers/providers');

const testProviderInterface = setupProviderTest({
  factory: (config) => new BrainyQuote(config),
  test
});

testProviderInterface('brainyquote');
