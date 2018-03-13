const Jimp = require('jimp');
const text = require('../text');

const { promisify } = require('util');

const BLACK = 0x0;
const BORDER_X = 100;
const BORDER_Y = 30;

/* istanbul ignore next */
if (process.platform === 'darwin') {
  module.exports = require('./macos');
} else {
  module.exports = require('./linux');
}

module.exports.create = async (image, title, description) => {
  const descriptionFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  const titleFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  image = await Jimp.read(image);

  const descriptionDimensions = text.measure(description, descriptionFont, image.bitmap.width);
  const titleDimensions = text.measure(title, titleFont, image.bitmap.width);

  const imageHeight = (2 * BORDER_Y) + image.bitmap.height +
    (titleDimensions.height + titleFont.common.lineHeight) +
    (descriptionDimensions.height + descriptionFont.common.lineHeight);
  const imageWidth = (2 * BORDER_X) + image.bitmap.width;

  const wallpaper = new Jimp(imageWidth, imageHeight).opaque().background(BLACK);

  const imageOffsetX = BORDER_X;
  const imageOffsetY = BORDER_Y + titleDimensions.height + titleFont.common.lineHeight;
  wallpaper.composite(image, imageOffsetX, imageOffsetY);

  const titleX = Math.floor((imageWidth - titleDimensions.width) / 2);
  const titleY = BORDER_Y;
  wallpaper.print(titleFont, titleX, titleY, title, image.bitmap.width);

  const descriptionX = BORDER_X;
  const descriptionY = BORDER_Y + titleDimensions.height + titleFont.common.lineHeight +
    image.bitmap.height + descriptionFont.common.lineHeight;
  wallpaper.print(descriptionFont, descriptionX, descriptionY, description, image.bitmap.width);

  const getBuffer = promisify(wallpaper.getBuffer.bind(wallpaper));
  return getBuffer(Jimp.MIME_PNG);
};
