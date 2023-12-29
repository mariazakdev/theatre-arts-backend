// const express = require('express');
// const router = express.Router();
// const usersController = require('../controllers/usersFireBaseControllers');

// router.get('/', usersController.getAllUsers); 
// router.post('/', usersController.createUser);
// router.get('/check-user', usersController.checkUserExistence);


// module.exports = router; 

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersFireBaseControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

router.get('/', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.getAllUsers(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.createUser(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.get('/check-user', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.checkUserExistence(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
