const assert = require('assert');
const fs = require('fs-extra');
const HttpContent = require('../content/HttpContent');
const path = require('path');
const Provider = require('./Provider');
const split = require('lodash/split');
const trim = require('lodash/trim');
const wallpaper = require('./util/wallpaper');

const { JSDOM } = require('jsdom');
const { URL } = require('url');

const BASE_URL = 'https://commons.wikimedia.org/wiki/Main_Page';

async function getImage (url) {
  const content = new HttpContent(url.toString());
  return content.data();
}

class Wikimedia extends Provider {
  constructor (config) {
    super('wikimedia', config, new HttpContent(BASE_URL));

    const state = config.get('state.directory');
    this.set('image', path.join(state, 'wikimedia.png'));
  }

  async invoke () {
    const content = await this._content.data();
    const html = new JSDOM(content.toString('utf8'));

    const imageElement = html.window.document.querySelector('#mainpage-potd > div > a > img');
    assert(imageElement, 'Wikimedia image element not found');
    const imageSrc = split(imageElement.srcset, /,\s+/).pop();
    const imageUrl = new URL(split(imageSrc, /\s+/).shift(), BASE_URL);
    const image = await getImage(imageUrl);

    const descriptionElement = html.window.document.querySelector('#mainpage-potd > div > span');
    assert(descriptionElement, 'Wikimedia description element not found');
    const description = trim(descriptionElement.textContent);

    const background = await wallpaper.create(image, '', description);
    const output = this.get('image');
    await fs.writeFile(output, background);
    await wallpaper.set(output);
    await super.invoke();
  }
}

module.exports = Wikimedia;
