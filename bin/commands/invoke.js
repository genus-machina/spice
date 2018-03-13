const find = require('lodash/find');
const providers = require('../../src/providers');
const sample = require('lodash/sample');

const shouldInvoke = (probability) => {
  if (!probability) {
    return false;
  }

  const roll = Math.random();
  return roll < probability;
};

exports.command = 'invoke [options] [provider]';
exports.description = 'Invoke a provider';

exports.builder = {
  probability: {
    alias: 'p',
    description: 'The probability that the invocation will run',
    type: 'number'
  }
};

exports.handler = async (argv) => {
  const name = argv.provider;
  const probability = argv.probability;
  let provider = null;

  if (!shouldInvoke(probability)) {
    console.log('Nothing to see here!');
    return;
  }

  if (name) {
    provider = find(providers, ['name', name]);
  } else {
    provider = sample(providers);
  }

  return provider.invoke();
};
