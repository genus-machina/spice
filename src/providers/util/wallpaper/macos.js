/* istanbul ignore file */
const wallpaper = require('wallpaper');

exports.set = async (image) => {
  return wallpaper.set(image, { scale: 'fit' });
};
