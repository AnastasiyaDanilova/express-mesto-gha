const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);

router.get('/', getUsers);

router.get('/:id', getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
