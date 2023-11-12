const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/handlePaymentControllers');

router.post('/', paymentController.payment);
router.get('/', paymentController.payment);


module.exports = router;