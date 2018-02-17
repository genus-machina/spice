const Configstore = require('configstore');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const project = require('../../package.json');

const STATE_DIR = path.join(os.homedir(), '.spice');

const config = new Configstore(
  project.name,
  {
    state: {
      dir: STATE_DIR
    }
  }
);

const providers = [
  require('./XKCD')
];

fs.ensureDirSync(STATE_DIR);
module.exports = providers.map((Provider) => new Provider(config));
