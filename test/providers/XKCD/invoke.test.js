const fs = require('fs-extra');
const moment = require('moment');
const nock = require('nock');
const path = require('path');
const test = require('ava');
const XKCD = require('../../../src/providers/XKCD');

const { rfc2822 } = require('../../content/helpers/dates');
const { setupProviderTest } = require('../helpers/providers');

const BASE_URL = 'https://xkcd.com';
const IMAGE_DESCRIPTION = 'this is a test image';
const IMAGE_FILE = path.join(__dirname, '..', 'fixtures', 'test.png');
const IMAGE_TITLE = 'test title';

const { testWallpaperProvider } = setupProviderTest({
  factory: (config) => new XKCD(config),
  test
});

test.beforeEach((test) => {
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
  nock.cleanAll();
  nock.enableNetConnect();
});

testWallpaperProvider('xkcd.png');
