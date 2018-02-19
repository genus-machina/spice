const HttpContent = require('../content/HttpContent');
const notifications = require('./util/notifications');
const Provider = require('./Provider');
const sample = require('lodash/sample');
const zipWith = require('lodash/zipWith');

const { JSDOM } = require('jsdom');

class BrainyQuote extends Provider {
  constructor (config) {
    super('brainyquote', config, new HttpContent('https://www.brainyquote.com/quote_of_the_day'));
  }

  async invoke () {
    const content = await this._content.data();
    const html = new JSDOM(content.toString('utf8'));

    const quotes = zipWith(
      Array.from(html.window.document.querySelectorAll('a[title="view author"]').values()),
      Array.from(html.window.document.querySelectorAll('a[title="view quote"]').values()),
      (author, quote) => `"${quote.textContent}" \u2014 ${author.textContent}`
    );

    await notifications.notify(sample(quotes));
    await super.invoke();
  }
}

module.exports = BrainyQuote;
