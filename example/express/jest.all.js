const config = require('./jest.config');
config.testRegex = '\\.(integration|test)\\.ts';
module.exports = config;
