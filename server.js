const express = require('express');
const config = require('./config');

const app = express();

app.listen(config.port, () => console.log(`App listening on port ${config.port}`));

module.exports = app;
