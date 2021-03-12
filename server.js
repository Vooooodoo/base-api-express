require('dotenv').config();
const express = require('express');

const { PORT } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
