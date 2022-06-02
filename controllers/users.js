const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка сервера: ${err.name}` }));
}

function getUserById(req, res) {
  User.findById(req.params.id)
    .then((userData) => {
      if (!userData) {
        return res.status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: userData });
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

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => {
      res.status(201)
        .send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errObject = Object.keys(err.errors).join(', ');
        return res.status(400)
          .send({ message: `Некорректные данные пользователя: ${errObject}` });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function updateProfile(req, res) {
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
        return res.status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errObject = Object.keys(err.errors).join(', ');
        return res.status(400)
          .send({ message: `Некорректные данные пользователя: ${errObject}` });
      }
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id пользователя' });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function updateAvatar(req, res) {
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
        return res.status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: 'Некорректная ссылка' });
      }
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id пользователя' });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
