// const express = require('express');
// const router = express.Router();
// const paymentController = require('../controllers/handlePaymentControllers');

// router.post('/', paymentController.payment);
// router.get('/', paymentController.payment);


// module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/handlePaymentControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

router.post('/', async (req, res, next) => {
  try {
    // Your route logic here
    await paymentController.payment(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    // Your route logic here
    await paymentController.payment(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
