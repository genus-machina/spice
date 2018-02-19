const assert = require('assert');
const fs = require('fs-extra');
const HttpContent = require('../content/HttpContent');
const Jimp = require('jimp');
const path = require('path');
const pixelWidth = require('string-pixel-width');
const Provider = require('./Provider');
const wallpaper = require('./util/wallpaper');

const { JSDOM } = require('jsdom');
const { promisify } = require('util');
const { URL } = require('url');

const BASE_URL = 'https://xkcd.com';
const DEFAULT_HEIGHT = 720;
const DEFAULT_WIDTH = 1280;

async function augmentImage (image, options) {
  const { description, title } = options;
  const background = new Jimp(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    .opaque()
    .background(0x0);

  const source = await Jimp.read(image);
  const x = Math.floor((background.bitmap.width - source.bitmap.width) / 2);
  const y = Math.floor((background.bitmap.height - source.bitmap.height) / 2);
  background.composite(source, x, y);

  await Promise.all([
    setDescription(background, source, description),
    setTitle(background, source, title)
  ]);

  const getBuffer = promisify(background.getBuffer.bind(background));
  return getBuffer(Jimp.MIME_PNG);
}

async function getImage (url) {
  const content = new HttpContent(url.toString());
  return content.data();
}

async function setDescription (destination, source, description) {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  const offset = 32;
  const x = Math.floor((destination.bitmap.width - source.bitmap.width) / 2);
  const y = Math.floor((destination.bitmap.height - source.bitmap.height) / 2) + source.bitmap.height + offset;

  destination.print(font, x, y, description, source.bitmap.width);
}

async function setTitle (destination, source, title) {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const fontSize = 32;

  const width = pixelWidth(
    title,
    {
      font: 'open sans',
      size: fontSize
    }
  );

  const x = Math.floor((destination.bitmap.width - width) / 2);
  const y = Math.floor((destination.bitmap.height - source.bitmap.height) / 2) - 2 * fontSize;

  destination.print(font, x, y, title);
}

class XKCD extends Provider {
  constructor (config) {
    super('xkcd', config, new HttpContent(BASE_URL));

    const state = config.get('state.directory');
    this.set('image', path.join(state, 'xkcd.png'));
  }

  async invoke () {
    const content = await this._content.data();
    const html = new JSDOM(content.toString('utf8'));
    const image = html.window.document.querySelector('#comic img');
    assert(image, 'XKCD image not found');

    const imageUrl = new URL(image.src, BASE_URL);
    let comic = await getImage(imageUrl);

    comic = await augmentImage(
      comic,
      {
        description: image.title,
        title: image.alt
      }
    );

    const output = this.get('image');
    await fs.writeFile(output, comic);
    await wallpaper.set(output);
    await super.invoke();
  }
}

module.exports = XKCD;
