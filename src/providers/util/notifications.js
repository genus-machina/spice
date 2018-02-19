/* istanbul ignore file */
const { promisify } = require('util');
const growl = promisify(require('growl'));

exports.notify = async (message) => growl(message, { sticky: true });
