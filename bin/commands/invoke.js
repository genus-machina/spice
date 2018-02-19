const find = require('lodash/find');
const providers = require('../../src/providers');

exports.command = 'invoke <provider>';
exports.description = 'Invoke a provider';

exports.handler = async (argv) => {
  const name = argv.provider;
  const provider = find(providers, ['name', name]);

  if (!provider) {
    throw new Error(`No provider named '${name}'`);
  }

  return provider.invoke();
};
