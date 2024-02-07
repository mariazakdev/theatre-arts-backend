
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/handlePaymentControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

router.post('/', async (req, res, next) => {
  try {
    await paymentController.payment(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await paymentController.payment(req, res);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
