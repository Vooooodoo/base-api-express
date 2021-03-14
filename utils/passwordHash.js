const bcrypt = require('bcryptjs');

const generatePassHash = (pass, salt) => {
  return bcrypt.hashSync(pass, Number(salt));
}

const comparePasswords = async () => {
  await bcrypt.compare(reqPass, dbPass);
}

module.exports = { generatePassHash, comparePasswords };
