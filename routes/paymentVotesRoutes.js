// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const votesController = require('../controllers/paymentVotesControllers');

// router.post('/', votesController.paidVotes);
// router.get('/', (req, res) => {
//     res.json("Hello from GET /votes");
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const votesController = require('../controllers/paymentVotesControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

router.post('/', async (req, res, next) => {
  try {
    // Your route logic here
    await votesController.paidVotes(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.get('/', (req, res) => {
  try {
    // Your route logic here
    res.json("Hello from GET /votes");
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
