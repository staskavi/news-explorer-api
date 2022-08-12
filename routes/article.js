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
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateUrl),
      image: Joi.string().required().custom(validateUrl),
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
