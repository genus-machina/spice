const HttpContent = require('../content/HttpContent');
const lists = require('./util/lists');
const notifications = require('./util/notifications');
const Provider = require('./Provider');
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

    await notifications.notify(lists.random(quotes));
    await super.invoke();
  }
}

module.exports = BrainyQuote;
