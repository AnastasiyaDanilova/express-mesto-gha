const router = require('express').Router();

const {
  getCard,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCard);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', addLike);

router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
