const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62987ff1da6b1aba875b2dce',
  };

  next();
});

app.use('/cards', require('./routes/user'));

app.use('/users', require('./routes/card'));

app.use((req, res) => res.status(404).send({ message: 'Запрашиваемой страницы не существует' }));

app.listen(PORT);
