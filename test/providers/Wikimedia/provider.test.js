const test = require('ava');
const Wikimedia = require('../../../src/providers/Wikimedia');

const { setupProviderTest } = require('../helpers/providers');

const { testProviderInterface } = setupProviderTest({
  factory: (config) => new Wikimedia(config),
  test
});

testProviderInterface('wikimedia');
