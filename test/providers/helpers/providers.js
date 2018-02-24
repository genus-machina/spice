const fs = require('fs-extra');
const MockConfig = require('./MockConfig');
const moment = require('moment');
const os = require('os');
const path = require('path');
const sinon = require('sinon');
const wallpaper = require('../../../src/providers/util/wallpaper');

function testProviderInterface (test, providerName) {
  test('The provider has a name', (test) => {
    test.is(test.context.provider.name, providerName);
  });

  test('The provider is ready if it has never been invoked', async (test) => {
    const ready = await test.context.provider.ready();
    test.true(ready);
  });

  test('The provider is ready if the provider content is newer than the local content', async (test) => {
    const localDate = moment();
    const providerDate = localDate.clone().add(1, 'day');

    const lastModified = sinon.stub(test.context.provider._content, 'lastModified').resolves(providerDate.toISOString());
    test.context.config.set(`${providerName}.latestContent`, localDate.toISOString());

    const ready = await test.context.provider.ready();
    test.true(ready);
    sinon.assert.calledWithExactly(lastModified);
  });

  test('The provider is not ready if the provider content is the same age as the local content', async (test) => {
    const date = moment();

    const lastModified = sinon.stub(test.context.provider._content, 'lastModified').resolves(date.toISOString());
    test.context.config.set(`${providerName}.latestContent`, date.toISOString());

    const ready = await test.context.provider.ready();
    test.false(ready);
    sinon.assert.calledWithExactly(lastModified);
  });

  test('The provider is not ready if the local content is newer than the provider content', async (test) => {
    const localDate = moment();
    const providerDate = localDate.clone().subtract(1, 'day');

    const lastModified = sinon.stub(test.context.provider._content, 'lastModified').resolves(providerDate.toISOString());
    test.context.config.set(`${providerName}.latestContent`, localDate.toISOString());

    const ready = await test.context.provider.ready();
    test.false(ready);
    sinon.assert.calledWithExactly(lastModified);
  });
}

function testWallpaperProvider (test, imageName) {
  test.beforeEach((test) => {
    test.context.setWallpaper = sinon.stub(wallpaper, 'set');
  });

  test.always.afterEach((test) => {
    test.context.setWallpaper.restore();
  });

  test.serial('Invoking the provider creates a local image', async (test) => {
    const image = path.join(test.context.stateDirectory, imageName);

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
    sinon.assert.calledWithExactly(test.context.setWallpaper, image);
  });
}

exports.setupProviderTest = ({factory, test}) => {
  test.beforeEach(async (test) => {
    test.context.config = new MockConfig();
    test.context.stateDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'test-state'));
    test.context.config.set('state.directory', test.context.stateDirectory);

    test.context.provider = factory(test.context.config);
  });

  test.always.afterEach(async (test) => {
    await fs.remove(test.context.stateDirectory);
  });

  return {
    testProviderInterface: testProviderInterface.bind(null, test),
    testWallpaperProvider: testWallpaperProvider.bind(null, test)
  };
};
