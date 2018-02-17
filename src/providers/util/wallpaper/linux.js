/* istanbul ignore file */
const path = require('path');

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
  const params = application.set.map((part) => part.replace('%s', path.resolve(image)));
  const command = [ application.command ].concat(params).join(' ');
  await run(command);
};
