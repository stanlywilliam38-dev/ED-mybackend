const express = require('express');
const router = express.Router();

const authMiddlewares = require('../../middlewares/auth')
const requireAuth = authMiddlewares.requireAuth;
const orderController = require("../../controllers/user/order")
 

router.post('/get-orders', orderController.getOrders)


module.exports = router;