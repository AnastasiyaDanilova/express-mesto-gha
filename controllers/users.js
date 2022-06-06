const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера: ${err.name}` }));
}

function getUserInfo(req, res) {
  User.findById(req.user._id)
    .then((userData) => {
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id пользователя' });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function getUserById(req, res, next) {
  User.findById(req.params.id)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id пользователя' });
      }
      return next(err);
    });
}

function createUser(req, res) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(201)
            .send({
              data: {
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
                _id: user._id,
              },
            });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const errObject = Object.keys(err.errors).join(', ');
            return res.status(400)
              .send({ message: `Некорректные данные пользователя: ${errObject}` });
          }
          if (err.code === 11000) {
            return res.status(409).send({ message: 'Такой email уже занят' });
          }
          return res.status(500)
            .send({ message: `Произошла ошибка сервера: ${err.name}` });
        });
    });
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.status(200)
        .send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errObject = Object.keys(err.errors).join(', ');
        res.status(400)
          .send({ message: `Некорректные данные пользователя: ${errObject}` });
      }
      if (err.name === 'CastError') {
        res.status(400)
          .send({ message: 'Некорректный id пользователя' });
      }
      return next(err);
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.status(200).send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Некорректная ссылка' });
      }
      if (err.name === 'CastError') {
        res.status(400)
          .send({ message: 'Некорректный id пользователя' });
      }
      return next(err);
    });
}

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ data: token })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
  login,
};
