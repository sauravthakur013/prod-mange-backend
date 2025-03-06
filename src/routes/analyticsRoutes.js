const express = require('express');
const router = express.Router();
const { getAnalyticsOverview } = require('../controllers/analyticsController');
const { protect } = require('./../middlewares/authMiddleware');

router.route('/overview').get(protect, getAnalyticsOverview); //Protect GET route

module.exports = router;