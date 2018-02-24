const APOD = require('../../../src/providers/APOD');
const fs = require('fs-extra');
const nock = require('nock');
const path = require('path');
const test = require('ava');

const { setupProviderTest } = require('../helpers/providers');

const BASE_URL = 'https://apod.nasa.gov';
const IMAGE_DESCRIPTION = 'this is the image!';
const IMAGE_FILE = path.join(__dirname, '..', 'fixtures', 'test.jpg');
const IMAGE_TITLE = 'Test Image';

const { testWallpaperProvider } = setupProviderTest({
  factory: (config) => new APOD(config),
  test
});

test.beforeEach((test) => {
  nock.disableNetConnect();
  nock(BASE_URL)
    .persist()
    .get('/apod/astropix.html')
    .reply(
      200,
      `
        <!DOCTYPE html>
        <html>
          <body>
            <center>
              <p>This is not the P you're looking for.</p>
              <p>2018 February 22
                <br>
                <a href="image/test.jpg">
                  <img src="image.jpg">
                </a>
              </p>
            </center>
            <center>
              <b>${IMAGE_TITLE}</b>
              blah blah blah
            </center>
            <p>
              <b>Explanation:</b>
              ${IMAGE_DESCRIPTION}
            </p>
          </body>
        </html>
      `
    );
  nock(BASE_URL)
    .get('/apod/image/test.jpg')
    .reply(200, () => fs.createReadStream(IMAGE_FILE));
});

test.always.afterEach((test) => {
  nock.cleanAll();
  nock.enableNetConnect();
});

testWallpaperProvider('apod.jpg');
