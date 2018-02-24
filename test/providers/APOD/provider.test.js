const APOD = require('../../../src/providers/APOD');
const test = require('ava');

const { setupProviderTest } = require('../helpers/providers');

const { testProviderInterface } = setupProviderTest({
  factory: (config) => new APOD(config),
  test
});

testProviderInterface('apod');
