const config = require('./jest.config');
config.testRegex = '\\.(integration)\\.ts';
module.exports = config;
