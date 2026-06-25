const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
