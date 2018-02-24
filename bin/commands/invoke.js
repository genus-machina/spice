const find = require('lodash/find');
const providers = require('../../src/providers');
const sample = require('lodash/sample');

exports.command = 'invoke [provider]';
exports.description = 'Invoke a provider';

exports.handler = async (argv) => {
  const name = argv.provider;
  let provider = null;

  if (name) {
    provider = find(providers, ['name', name]);
  } else {
    provider = sample(providers);
  }

  return provider.invoke();
};
