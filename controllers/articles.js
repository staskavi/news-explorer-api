const Article = require('../models/article');
const errorStatuses = require('../utils/errorStatuses');
const BadRequestError = require('../errors/badRequestError');//400
const NotFoundError = require('../errors/notFoundError');//404
const ForbiddenError = require('../errors/forbiddenError');//409

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.status(errorStatuses.OK).send(articles))
    .catch(() => {
      throw new NotFoundError("No articles found");
    })
    .catch(next);
};

const addArticle = (req, res, next) => {
  const owner = req.user._id;
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => {
      res.status(errorStatuses.OK).send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError("Bad request");
      }
    })
    .catch(next);
};

const removeArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError("No articles found");
      }
      if (article.owner.toString() === req.user._id.toString()) {
        Article.deleteOne(article).then((deletedArticle) => {
          res.status(errorStatuses.OK).send(deletedArticle);
        });
      } else {
        throw new ForbiddenError("Not allowed");
      }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  addArticle,
  removeArticle,
};
