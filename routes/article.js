const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getArticles, addArticle, removeArticle,
} = require('../controllers/articles');

router.get('/articles', getArticles);

router.post(
  '/articles',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  }),
  addArticle,
);

router.delete(
  '/articles/:articleId',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      articleId: Joi.string().hex().required(),
    }),
  }),
  removeArticle,
);

module.exports = router;
