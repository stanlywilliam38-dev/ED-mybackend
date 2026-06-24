const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const homeRouter = require('./home');
const orderRouter = require('./order');
// const expertsRouter = require('./to_experts');
const profileRouter = require('./profile');
const adminRouter = require('./admin');
const blogsRouter = require('./blogs');
const expertsRouter = require('./experts');

router.use('/users', userRouter);
router.use('/home', homeRouter);
router.use('/order', orderRouter);
// router.use('/to_experts', expertsRouter);
router.use('/profile', profileRouter);
router.use("/admin", adminRouter);
router.use("/blogs", blogsRouter);
router.use("/experts", expertsRouter);

module.exports = router;