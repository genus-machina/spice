const BrainyQuote = require('../../../src/providers/BrainyQuote');
const includes = require('lodash/includes');
const moment = require('moment');
const notifications = require('../../../src/providers/util/notifications');
const sinon = require('sinon');
const test = require('ava');

const { setupProviderTest } = require('../helpers/providers');

setupProviderTest({
  factory: (config) => new BrainyQuote(config),
  test
});

test.beforeEach((test) => {
  const now = moment();
  test.context.sandbox = sinon.sandbox.create();

  test.context.getContent = test.context.sandbox.stub(test.context.provider._content, 'data')
    .resolves(`
      <!DOCTYPE html>
      <html>
        <body>
          <div>
            <a href="/quote-one" title="view quote">This is the first quote.</a>
            <a href="/author-one" title="view author">Thing One</a>
          </div>
          <div>
            <a href="/quote-two" title="view quote">This is the second quote.</a>
            <a href="/author-two" title="view author">Thing Two</a>
          </div>
        </body>
      </html>
    `);

  test.context.getLastModified = test.context.sandbox.stub(test.context.provider._content, 'lastModified')
    .resolves(now.toISOString());

  test.context.notify = test.context.sandbox.stub(notifications, 'notify').resolves();
});

test.always.afterEach((test) => {
  test.context.sandbox.restore();
});

test('Invoking the provider creates a notification with a random quote', async (test) => {
  const quotes = [
    'This is the first quote. \u2014 Thing One',
    'This is the second quote. \u2014 Thing Two'
  ];

  await test.context.provider.invoke();
  sinon.assert.calledWithExactly(test.context.getContent);
  sinon.assert.calledWithExactly(test.context.getLastModified);
  sinon.assert.calledWithExactly(test.context.notify, sinon.match.string);
  test.true(includes(quotes, test.context.notify.firstCall.args[0]));
});
