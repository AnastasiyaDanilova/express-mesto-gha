require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);

app.post('/signup', createUser);

app.use('/users', auth, require('./routes/user'));

app.use('/cards', auth, require('./routes/card'));

app.use((req, res) => res.status(404).send({ message: 'Запрашиваемой страницы не существует' }));

app.listen(PORT);
