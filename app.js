const express = require('express');
const router = require('express').Router();
// подключим ORM-библиотеку для приложений на Node.js
// при использовании Sequelize можно не писать SQL-запросы,
// а работать с данными как с обычными объектами
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bcrypt = require('bcryptjs'); // модуль для хэширования пароля пользователя

const { PORT = 4000 } = process.env;

const app = express();

const sequelize = new Sequelize('super_db', 'super_user', 'super3000', {
  dialect: 'postgres'
}); // подключились к СУБД PostgreSQL

// MODELS
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dob: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

// CONTROLLERS
const getUsers = (req, res, next) => {
  User.findAll({ raw: true })
    .then(data => res.send(data))

    .catch(next);
}

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
    dob,
  } = req.body;

  // хешируем пароль с помощью модуля bcrypt, 10 - это длина «соли»,
  // случайной строки, которую метод добавит к паролю перед хешированием, для безопасности
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // записали хеш в базу
      dob,
    }))

    .then((data) => {
      res.send({
        id: data.id,
        name: data.name,
        email: data.email,
        dob: data.dob,
      }); // вернули объект из базы с записанными в него данными пользователя
    })

    .catch(next);
}

const removeUser = (req, res, next) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.status(201).send('Пользователь удалён!'))

    .catch(next);
}

// ROUTES
router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', removeUser);

// метод sync() синхронизирует структуру базы данных с определением моделей,
// если в бд есть подобная таблица, но она не соответствует определению модели,
// то можно использоать параметр { force: true }, чтобы удалить таблицы и создать их заново,
// но уже с новой структурой
// sequelize.sync()
//   .then(result => console.log(result))

//   .catch(err => console.log(err));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', router);

app.use('*', (req, res) => {
  res.status(404).send('Запрашиваемый ресурс не найден.');
});

// централизованная обработка ошибок
app.use((error, req, res, next) => {
  // если ошибка сгенерирована не нами - выставляем статус 500
  const { statusCode = 500, message } = error;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}: http://localhost:4000`);
});
