const LATEST_CONTENT = 'latestContent';

class Provider {
  constructor (name, config, content) {
    this._config = config;
    this._content = content;
    this._name = name;
  }

  get name () {
    return this._name;
  }

  get (key) {
    const scopedKey = this._scopedKey(key);
    return this._config.get(scopedKey);
  }

  async invoke () {
    const lastModified = await this._content.lastModified();
    this.set(LATEST_CONTENT, lastModified);
  }

  async ready () {
    const latestContent = this._latestContent();

    if (!latestContent) {
      return true;
    }

    const lastModified = await this._content.lastModified();
    return lastModified > latestContent;
  }

  set (key, value) {
    const scopedKey = this._scopedKey(key);
    this._config.set(scopedKey, value);
  }

  _latestContent () {
    return this.get(LATEST_CONTENT) || null;
  }

  _scopedKey (key) {
    return `${this._name}.${key}`;
  }
}

module.exports = Provider;
