const fs = require('fs-extra');
const moment = require('moment');
const nock = require('nock');
const path = require('path');
const sinon = require('sinon');
const test = require('ava');
const XKCD = require('../../../src/providers/XKCD');
const wallpaper = require('../../../src/providers/util/wallpaper');

const { rfc2822 } = require('../../content/helpers/dates');
const { setupProviderTest } = require('../helpers/providers');

const BASE_URL = 'https://xkcd.com';
const IMAGE_DESCRIPTION = 'this is a test image';
const IMAGE_FILE = path.join(__dirname, 'fixtures', 'test.png');
const IMAGE_TITLE = 'test title';

setupProviderTest({
  factory: (config) => new XKCD(config),
  test
});

test.beforeEach((test) => {
  test.context.sandbox = sinon.sandbox.create();
  test.context.sandbox.stub(wallpaper, 'set');

  nock.disableNetConnect();
  nock(BASE_URL)
    .persist()
    .head('/')
    .reply(200, null, { 'last-modified': rfc2822(moment()) });
  nock(BASE_URL)
    .get('/')
    .reply(
      200,
      `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="comic">
            <img src="//images/test.png" alt="${IMAGE_TITLE}" title="${IMAGE_DESCRIPTION}"/>
          </div>
        </body>
      </html>
      `
    );
  nock('https://images')
    .get('/test.png')
    .reply(200, () => fs.createReadStream(IMAGE_FILE));
});

test.always.afterEach((test) => {
  test.context.sandbox.restore();
  nock.cleanAll();
  nock.enableNetConnect();
});

test.serial('Invoking the provider creates a local image', async (test) => {
  const image = path.join(test.context.stateDirectory, 'xkcd.png');

  test.is(test.context.provider.get('image'), image);
  await test.context.provider.invoke();

  const exists = (await fs.stat(image)).isFile();
  test.true(exists);
});

test.serial('Invoking the provider updates the latest content', async (test) => {
  let ready = await test.context.provider.ready();
  test.true(ready);
  await test.context.provider.invoke();

  ready = await test.context.provider.ready();
  test.false(ready);
});

test.serial('Invoking the provider sets the desktop wallpaper', async (test) => {
  const image = test.context.provider.get('image');
  await test.context.provider.invoke();
  sinon.assert.calledWithExactly(wallpaper.set, image);
});
