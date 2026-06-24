const express = require('express');
const router = express.Router();
const authMiddlewares = require('../../middlewares/auth')
const requireAuth = authMiddlewares.requireAuth;
const searchController = require("../../controllers/experts/search");
router.post('/get-search', searchController.getSearch);
module.exports = router;