const HttpContent = require('../../../src/content/HttpContent');
const moment = require('moment');
const nock = require('nock');
const test = require('ava');

const { rfc2822 } = require('../helpers/dates');

test.beforeEach((test) => {
  const url = 'http://localhost';
  test.context.headers = {};
  test.context.http = new HttpContent(url);

  nock.disableNetConnect();
  nock(url)
    .head('/')
    .reply(() => [ 200, null, test.context.headers ]);
});

test.always.afterEach((test) => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test('The last modified header is used as the last modified date', async (test) => {
  const date = moment().startOf('second');
  test.context.headers['last-modified'] = rfc2822(date);

  const lastModified = await test.context.http.lastModified();
  test.is(lastModified, date.toISOString());
});

test('An error is thrown if no last modified header is available', async (test) => {
  await test.throws(test.context.http.lastModified(), 'The server did not provide a Last-Modified header');
});
