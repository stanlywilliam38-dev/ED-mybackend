const express = require('express');
const router = express.Router();

const usersController = require("../../../controllers/admin/user");
router.post('/get-users', usersController.getUsers);
router.post('/change-type', usersController.changeType);
router.get('/block-user', usersController.blockUser);
module.exports = router;