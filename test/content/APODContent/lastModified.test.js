const APODContent = require('../../../src/content/APODContent');
const moment = require('moment');
const nock = require('nock');
const test = require('ava');

const APOD_FORMAT = 'YYYY MMMM DD';

test.beforeEach((test) => {
  test.context.apod = new APODContent();
  test.context.content = `
    <!DOCTYPE html>
    <html>
      <body>
      </body>
    </html>
  `;

  nock.disableNetConnect();
  nock('https://apod.nasa.gov')
    .get('/apod/astropix.html')
    .reply(200, () => test.context.content);
});

test.always.afterEach((test) => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test('The modified date is extracted from the page content', async (test) => {
  const now = moment();

  test.context.content = `
    <!DOCTYPE html>
    <html>
      <body>
        <center>
          <p>Nothing to see here</p>
          <p>
            ${now.format(APOD_FORMAT)}
          </p>
        </center>
      </body>
    </html>
  `;

  const lastModified = await test.context.apod.lastModified();
  test.is(lastModified, now.startOf('day').toISOString());
});

test('When the date cannot be extracted the current time is used', async (test) => {
  const lastModified = await test.context.apod.lastModified();
  const now = moment();

  const after = now.clone().add(1, 'minute').toISOString();
  const before = now.clone().subtract(1, 'minute').toISOString();
  test.true(lastModified > before && lastModified < after);
});
