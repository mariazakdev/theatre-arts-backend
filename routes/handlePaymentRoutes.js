const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/handlePaymentControllers');

router.post('/', paymentController.handlePayment);

module.exports = router;