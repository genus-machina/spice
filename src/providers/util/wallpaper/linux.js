/* istanbul ignore file */
const { exec } = require('child_process');
const { promisify } = require('util');

const run = promisify(exec);

const applications = [
  {
    command: 'xfconf-query',
    set: async (image) => {
      await run(`xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor0/workspace0/last-image -s ${image}`);
      await run('xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor0/workspace0/image-style -s 4');
    }
  }
];

exports.set = async (image) => {
  const application = applications[0];
  await application.set(image);
};
