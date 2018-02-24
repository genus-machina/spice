const HttpContent = require('./HttpContent');
const moment = require('moment');
const trim = require('lodash/trim');

const { JSDOM } = require('jsdom');

const APOD_FORMAT = 'YYYY MMMM DD';

class APODContent extends HttpContent {
  constructor () {
    const url = 'https://apod.nasa.gov/apod/astropix.html';
    super(url);
    this._url = url;
  }

  get url () {
    return this._url;
  }

  async lastModified () {
    const content = await this.data();
    const dom = new JSDOM(content.toString('utf8'));

    const dateElement = dom.window.document.querySelector('center > p:nth-of-type(2)');

    if (dateElement) {
      const date = moment(trim(dateElement.textContent), APOD_FORMAT);
      return date.toISOString();
    }

    return moment().toISOString();
  }
}

module.exports = APODContent;
