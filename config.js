const dotenv = require('dotenv');
const envType = process.env.NODE_ENV || 'development';

const config = dotenv.parse();

config.isDev = envType === 'development';

module.exports = config;
