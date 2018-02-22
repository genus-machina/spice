const get = require('lodash/get');
const split = require('lodash/split');

const measureText = (text, font) => {
  const dimensions = {
    height: font.common.lineHeight,
    width: 0
  };

  for (let i = 0; i < text.length; i++) {
    const char = font.chars[text[i]];
    const advance = char.xadvance;
    const kerning = get(font.kernings, `${text[i]}.${text[i + 1]}`, 0);

    dimensions.height = Math.max(dimensions.height, char.y + char.height + char.yoffset);
    dimensions.width += char.xoffset + kerning + advance;
  }

  return dimensions;
};

exports.measure = (text, font, maxWidth = Number.POSITIVE_INFINITY) => {
  const dimensions = { height: 0, width: 0 };
  const words = split(text, ' ');

  let line = '';
  let lineDimensions = { height: 0, width: 0 };

  for (let n = 0; n < words.length; n++) {
    const testLine = line + (line.length ? ' ' : '') + words[n];
    const testDimensions = measureText(testLine, font);

    if (testDimensions.width > maxWidth && n > 0) {
      dimensions.height += lineDimensions.height;
      dimensions.width = Math.max(dimensions.width, lineDimensions.width);
      line = words[n];
    } else {
      line = testLine;
      lineDimensions = testDimensions;
    }
  }

  dimensions.height += lineDimensions.height;
  dimensions.width = Math.max(dimensions.width, lineDimensions.width);
  return dimensions;
};
