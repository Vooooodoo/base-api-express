const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const envConfigs = require('../config/config');

const basename = path.basename(__filename);
const env = 'development';
const config = envConfigs[env];
const db = {};

const sequelize = new Sequelize(config.url, config);

// метод sync() синхронизирует структуру базы данных с определением моделей,
// если в бд есть подобная таблица, но она не соответствует определению модели,
// то можно использоать параметр { force: true }, чтобы удалить таблицы и создать их заново,
// но уже с новой структурой
// sequelize.sync({ force: true })
//   .then(result => console.log(result))

//   .catch(err => console.log(err));

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })

  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
