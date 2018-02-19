const axios = require('axios');
const moment = require('moment');

function parseLastModified (response) {
  const lastModified = response.headers['last-modified'];

  if (!lastModified) {
    return moment().toISOString();
  }

  return moment(lastModified, moment.RFC_2822, true).toISOString();
}

class HttpContent {
  constructor (url) {
    this._client = axios.create({
      baseURL: url,
      responseType: 'arraybuffer'
    });
  }

  async data () {
    const response = await this._client.get();
    return response.data;
  }

  async lastModified () {
    const response = await this._client.head();
    return parseLastModified(response);
  }
}

module.exports = HttpContent;
