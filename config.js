// const dotenv = require('dotenv');
require('dotenv');

// const envTypes = {
//   dev: 'development',
//   prod: 'production'
// }

// const envType = process.env.NODE_ENV || 'development';

// const config = dotenv.parse();



// let parsedEnv;
// switch (envType) {
//   case envTypes.prod:

//     break;

//   default:
//     break;
// }

// config.isDev = envType === 'development';

const config = {
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT,
  db: {
    devUrl: process.env.DEV_DB_URL,
  },
  token: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  passwordHash: {
    salt: process.env.PASSWORD_HASH_SALT,
  }
}

module.exports = config;
