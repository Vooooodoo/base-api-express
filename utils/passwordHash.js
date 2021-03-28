const bcrypt = require('bcryptjs');
const config = require('../config');

const generatePassHash = pass => bcrypt.hashSync(pass, Number(config.passwordHash.salt));

const comparePasswords = async (reqPass, dbPass) => await bcrypt.compare(reqPass, dbPass);

module.exports = { generatePassHash, comparePasswords };
