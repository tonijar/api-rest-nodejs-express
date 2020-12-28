const config = require('config');
const bunyan = require('bunyan');

exports.logger = bunyan.createLogger({ name: config.get('app-name') });