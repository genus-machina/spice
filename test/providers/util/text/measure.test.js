const Jimp = require('jimp');
const test = require('ava');
const text = require('../../../../src/providers/util/text');

test('Measuring a string of text returns the width and height of the text block', async (test) => {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  const dimensions = text.measure('this is a test', font);

  test.deepEqual(
    dimensions,
    {
      height: 22,
      width: 88
    }
  );
});

test('Measuring a string of text with a bounded width returns the width and height of the wrapped block', async (test) => {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  const dimensions = text.measure('this is a test', font, 42);

  test.deepEqual(
    dimensions,
    {
      height: 66,
      width: 27
    }
  );
});
