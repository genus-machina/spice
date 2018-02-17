const dotProp = require('dot-prop');

class MockConfig {
  constructor () {
    this._data = {};
  }

  get (key) {
    return dotProp.get(this._data, key);
  }

  set (key, value) {
    return dotProp.set(this._data, key, value);
  }
}

module.exports = MockConfig;
