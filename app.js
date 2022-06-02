const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, __, next) => {
  req.user = {
    _id: '62987ff1da6b1aba875b2dce',
  };

  next();
});

app.use('/', require('./routes/user'));

app.use('/', require('./routes/card'));

app.listen(PORT);
