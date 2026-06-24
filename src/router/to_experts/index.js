const express = require('express');
const router = express.Router();
const ExportController = require('../../controllers/profile/to_expert');

router.use('/', ExportController.getExpert);
router.use('/', ExportController.toExpert);
module.exports = router;