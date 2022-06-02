const Card = require('../models/card');

function getCard(req, res) {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((cardData) => {
      res.status(201)
        .send({ data: cardData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errObject = Object.keys(err.errors).join(', ');
        return res.status(400)
          .send({ message: `Некорректные данные: ${errObject}` });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function deleteCard(req, res) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return card.remove()
        .then((cardData) => {
          res.status(200)
            .send({ data: cardData });
        });
    }).catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id карточки' });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function addLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(404)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200)
        .send({ data: cardData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id карточки' });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

function deleteLike(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(404)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(200)
        .send({ data: cardData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400)
          .send({ message: 'Некорректный id карточки' });
      }
      return res.status(500)
        .send({ message: `Произошла ошибка сервера: ${err.name}` });
    });
}

module.exports = {
  getCard,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
