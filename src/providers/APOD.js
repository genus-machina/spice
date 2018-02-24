const APODContent = require('../content/APODContent');
const assert = require('assert');
const fs = require('fs-extra');
const HttpContent = require('../content/HttpContent');
const path = require('path');
const Provider = require('./Provider');
const replace = require('lodash/replace');
const trim = require('lodash/trim');
const wallpaper = require('./util/wallpaper');

const { JSDOM } = require('jsdom');
const { URL } = require('url');

async function getImage (url) {
  const content = new HttpContent(url.toString());
  return content.data();
}

class APOD extends Provider {
  constructor (config) {
    super('apod', config, new APODContent());

    const state = config.get('state.directory');
    this.set('image', path.join(state, 'apod.jpg'));
  }

  async invoke () {
    const content = await this._content.data();
    const html = new JSDOM(content.toString('utf8'));

    const imageElement = html.window.document.querySelector('body > center > p:nth-of-type(2) > a');
    assert(imageElement, 'APOD image element not found');
    const imageUrl = new URL(imageElement.href, this._content.url);
    const image = await getImage(imageUrl);

    const titleElement = html.window.document.querySelector('body > center:nth-of-type(2) > b');
    assert(titleElement, 'APOD title element not found');
    const title = trim(titleElement.textContent);

    const descriptionElement = html.window.document.querySelector('body > p');
    assert(descriptionElement, 'APOD description element not found');

    let description = replace(descriptionElement.textContent, /^\s+Explanation:\s+/, '');
    description = replace(description, /\n/g, ' ');
    description = trim(description);

    const background = await wallpaper.create(image, title, description);
    const output = this.get('image');
    await fs.writeFile(output, background);
    await wallpaper.set(output);
    await super.invoke();
  }
}

module.exports = APOD;
