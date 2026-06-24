const express = require('express');
const router = express.Router();

const expertsController = require("../../../controllers/admin/experts");
router.post('/', expertsController.getExperts);
router.post('/allow-expert', expertsController.allowExpert);
router.get('/block-user', expertsController.blockUser);
module.exports = router;