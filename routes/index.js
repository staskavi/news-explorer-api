const router = require('express').Router();
const auth = require('../middleware/auth');
const usersRouter = require('./users');
const articleRouter = require('./article');
const signInRouter = require('./signIn');
const signUpRouter = require('./signUp');

router.use('/', signInRouter);
router.use('/', signUpRouter);
router.use(auth);
router.use('/', usersRouter);
router.use('/', articleRouter);

module.exports = router;
