const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);

module.exports = router;
