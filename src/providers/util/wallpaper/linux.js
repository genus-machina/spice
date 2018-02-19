/* istanbul ignore file */
const map = require('lodash/map');
const path = require('path');
const replace = require('lodash/replace');

const { exec } = require('child_process');
const { promisify } = require('util');

const run = promisify(exec);

const applications = [
  {
    command: 'xfconf-query',
    set: [
      '-c xfce4-desktop',
      '-p /backdrop/screen0/monitor0/workspace0/last-image',
      '-s %s'
    ]
  }
];

exports.set = async (image) => {
  const application = applications[0];
  const params = map(application.set, (part) => replace(part, '%s', path.resolve(image)));
  const command = [ application.command ].concat(params).join(' ');
  await run(command);
};
