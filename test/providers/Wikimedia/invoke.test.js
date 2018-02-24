const fs = require('fs-extra');
const moment = require('moment');
const nock = require('nock');
const path = require('path');
const test = require('ava');
const Wikimedia = require('../../../src/providers/Wikimedia');

const { rfc2822 } = require('../../content/helpers/dates');
const { setupProviderTest } = require('../helpers/providers');

const BASE_URL = 'https://commons.wikimedia.org';
const IMAGE_DESCRIPTION = 'this is a test image';
const IMAGE_FILE = path.join(__dirname, '..', 'fixtures', 'test.jpg');

const { testWallpaperProvider } = setupProviderTest({
  factory: (config) => new Wikimedia(config),
  test
});

test.beforeEach((test) => {
  nock.disableNetConnect();
  nock(BASE_URL)
    .persist()
    .head('/wiki/Main_Page')
    .reply(200, null, { 'last-modified': rfc2822(moment()) });
  nock(BASE_URL)
    .get('/wiki/Main_Page')
    .reply(
      200,
      `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="mainpage-potd">
            <div>
              <a href="">
                <img srcset="http://bogus 1x, https://images/test.jpg 2x">
              </a>
            </div>
            <div>
              <span>${IMAGE_DESCRIPTION}</span>
            </div>
          </div>
        </body>
      </html>
      `
    );
  nock('https://images')
    .get('/test.jpg')
    .reply(200, () => fs.createReadStream(IMAGE_FILE));
});

test.always.afterEach((test) => {
  nock.cleanAll();
  nock.enableNetConnect();
});

testWallpaperProvider('wikimedia.png');
