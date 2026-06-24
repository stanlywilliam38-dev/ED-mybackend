const express = require('express');
const router = express.Router();

const homeController = require("../../controllers/home");
router.get('/get-states', homeController.getStates);
module.exports = router;