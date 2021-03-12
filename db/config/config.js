const config = require('../../config');

module.exports = {
  development: {
    url: config.db.devUrl,
    dialect: 'postgres',
  },
};
