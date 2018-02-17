const HttpContent = require('../../../src/content/HttpContent');
const moment = require('moment');
const nock = require('nock');
const test = require('ava');

const { rfc2822 } = require('../helpers/dates');

test.beforeEach((test) => {
  const url = 'http://localhost';
  test.context.date = moment();
  test.context.payload = 'hello!';
  test.context.http = new HttpContent(url);

  nock.disableNetConnect();
  nock(url)
    .get('/')
    .reply(200, test.context.payload, { 'last-modified': rfc2822(test.context.date) });
});

test.always.afterEach((test) => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test('Fetching the content returns the server response payload', async (test) => {
  const content = await test.context.http.data();
  test.deepEqual(content, Buffer.from(test.context.payload));
});
