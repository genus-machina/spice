const MockConfig = require('../helpers/MockConfig');
const moment = require('moment');
const sinon = require('sinon');
const test = require('ava');
const XKCD = require('../../../src/providers/XKCD');

test.beforeEach((test) => {
  test.context.config = new MockConfig();
  test.context.config.set('state.dir', 'bogus');

  test.context.xkcd = new XKCD(test.context.config);
});

test('The provider is ready if it has never been invoked', async (test) => {
  const ready = await test.context.xkcd.ready();
  test.true(ready);
});

test('The provider is ready if the provider content is newer than the local content', async (test) => {
  const localDate = moment();
  const providerDate = localDate.clone().add(1, 'day');

  const lastModified = sinon.stub(test.context.xkcd._content, 'lastModified').resolves(providerDate.toISOString());
  test.context.config.set('xkcd.latestContent', localDate.toISOString());

  const ready = await test.context.xkcd.ready();
  test.true(ready);
  sinon.assert.calledWithExactly(lastModified);
});

test('The provider is not ready if the provider content is the same age as the local content', async (test) => {
  const date = moment();

  const lastModified = sinon.stub(test.context.xkcd._content, 'lastModified').resolves(date.toISOString());
  test.context.config.set('xkcd.latestContent', date.toISOString());

  const ready = await test.context.xkcd.ready();
  test.false(ready);
  sinon.assert.calledWithExactly(lastModified);
});

test('The provider is not ready if the local content is newer than the provider content', async (test) => {
  const localDate = moment();
  const providerDate = localDate.clone().subtract(1, 'day');

  const lastModified = sinon.stub(test.context.xkcd._content, 'lastModified').resolves(providerDate.toISOString());
  test.context.config.set('xkcd.latestContent', localDate.toISOString());

  const ready = await test.context.xkcd.ready();
  test.false(ready);
  sinon.assert.calledWithExactly(lastModified);
});
