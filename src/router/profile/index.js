const express = require('express');
const router = express.Router();
const authMiddlewares = require('../../middlewares/auth')
const requireAuth = authMiddlewares.requireAuth;
const informationController = require('../../controllers/profile/information');
const expertController = require('../../controllers/profile/to_expert');

router.post('/edit-information', informationController.editInformation);
router.post('/get-information', informationController.getInformation);
router.post('/charge-money',requireAuth, informationController.chargeMoney);
router.post('/to_expert',requireAuth, expertController.toExpertUser);
router.put('/review-rate', requireAuth, informationController.setReviewRate)


module.exports = router;