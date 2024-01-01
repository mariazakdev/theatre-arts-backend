const express = require('express');
console.log('express:', express);
const router = express.Router();
const verifyTokenFirebase = require('../middlewares/verifyTokenFirebase');
const dashboardController = require('../controllers/dashboardControllers');

// Route to serve the dashboard page
router.get('/', verifyTokenFirebase, async (req, res) => {
  try {
    // The user information from Firebase Authentication and MySQL is available in req.user
    const userId = req.user.uid;

    const result = await dashboardController.getDashboardData(userId);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    // Render the dashboard page with the data
    res.render('dashboard', { data: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// New route to receive Firebase token and return contestant data
router.post('/getContestantData', verifyTokenFirebase, async (req, res) => {
  console.log('Received POST request to /getContestantData');

  try {
    const firebaseToken = req.body.token;

    // Assuming you have a function to decode the Firebase token and get the user ID
    const userId = decodeFirebaseTokenAndGetUserId(firebaseToken);

    if (!userId) {
      return res.status(400).json({ error: 'Invalid Firebase token' });
    }

    const result = await dashboardController.getDashboardData(userId);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Decode Firebase token and get user ID (example function, replace with your actual implementation)
const decodeFirebaseTokenAndGetUserId = (token) => {
  // Implement your decoding logic here
  // Return the user ID or null if the token is invalid
};

module.exports = router;





























// const express = require('express');
// const router = express.Router();
// const knex = require('knex')(require('../knexfile'));
// const authenticateFirebaseUser = require('../middlewares/authenticateFirebaseUser'); 
// const dashboardController = require('../controllers/dashboardControllers');

// router.get('/', authenticateFirebaseUser, dashboardController.getUserDashboard);


// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const knex = require('knex')(require('../knexfile'));
// const authenticateFirebaseUser = require('../middlewares/authenticateFirebaseUser');
// const dashboardController = require('../controllers/dashboardControllers');
// const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware'); 

// router.get('/', authenticateFirebaseUser, async (req, res, next) => {
 
//   try {
//     const data = await dashboardController.getUserDashboard(req, res, next);
//     // res.json(data);
//     // console.log("Data:", data);
//     } catch (error) {
//       // console.error("Error:", error.message);    
//       next(error);
//   }
// });

// router.use(errorHandlingMiddleware);

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const authenticateFirebaseUser = require('../middlewares/authenticateFirebaseUser');
// const dashboardController = require('../controllers/dashboardControllers');
// const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

// router.get('/', authenticateFirebaseUser, (req, res, next) => {
//   dashboardController.getData(req, res, next).catch(next);
// });

// router.use(errorHandlingMiddleware);

// module.exports = router;
