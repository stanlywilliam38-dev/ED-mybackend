const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const expertsRouter = require('./experts');

router.use('/users', usersRouter);
router.use('/experts', expertsRouter);

module.exports = router;