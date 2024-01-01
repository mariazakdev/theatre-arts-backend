
const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'));

const usersController = require('../controllers/usersFireBaseControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');
const { getUserById } = require('../controllers/usersFireBaseControllers');

router.post('/login', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.loginUser(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/:userId', usersController.getUserById);

router.get('/', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.getAllUsers(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.createUser(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/check-user', async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.checkUserExistence(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// router.get('/:id', async (req, res, next) => {
//   try {
//     // Get the user ID from the URL parameters
//     const userId = req.params.id;
//     // Your route logic here
//     // await usersController.getUserById(userId, req, res);
//     // await usersController.getUserById( req, res);
//     const userData = await usersController.getUserById(userId, req.body.firebaseId);

//     res.status(200).json(userData);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error.' });
    
//   }
// });

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
