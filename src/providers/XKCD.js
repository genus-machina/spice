const assert = require('assert');
const fs = require('fs-extra');
const HttpContent = require('../content/HttpContent');
const path = require('path');
const Provider = require('./Provider');
const wallpaper = require('./util/wallpaper');

const { JSDOM } = require('jsdom');
const { URL } = require('url');

const BASE_URL = 'https://xkcd.com';

async function getImage (url) {
  const content = new HttpContent(url.toString());
  return content.data();
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
    const comic = await getImage(imageUrl);
    const background = await wallpaper.create(comic, image.alt, image.title);

    const output = this.get('image');
    await fs.writeFile(output, background);
    await wallpaper.set(output);
    await super.invoke();
  }
}

module.exports = XKCD;
