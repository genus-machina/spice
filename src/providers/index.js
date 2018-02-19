const Configstore = require('configstore');
const fs = require('fs-extra');
const map = require('lodash/map');
const os = require('os');
const path = require('path');
const project = require('../../package.json');

const STATE_DIRECTORY = path.join(os.homedir(), '.spice');

const config = new Configstore(
  project.name,
  {
    state: {
      directory: STATE_DIRECTORY
    }
  }
);

const providers = [
  require('./BrainyQuote'),
  require('./XKCD')
];

fs.ensureDirSync(STATE_DIRECTORY);
module.exports = map(providers, (Provider) => new Provider(config));
