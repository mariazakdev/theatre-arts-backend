// const express = require('express');
// const router = express.Router();
// const knex = require('knex')(require('../knexfile'));
// const authenticateFirebaseUser = require('../middlewares/authenticateFirebaseUser'); 
// const dashboardController = require('../controllers/dashboardControllers');

// router.get('/', authenticateFirebaseUser, dashboardController.getUserDashboard);


// module.exports = router;

const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'));
const authenticateFirebaseUser = require('../middlewares/authenticateFirebaseUser');
const dashboardController = require('../controllers/dashboardControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware'); // Assuming this is the path to your error handling middleware

router.get('/', authenticateFirebaseUser, async (req, res, next) => {
  try {
    // Your route logic here
    const data = await dashboardController.getUserDashboard();
    res.json(data);
  } catch (error) {
    // Call your custom error handling middleware
    errorHandlingMiddleware(error, req, res, next);
  }
});

// Use your custom error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
