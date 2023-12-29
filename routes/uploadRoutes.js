// const express = require('express');
// const router = express.Router();
// const uploadController = require('../controllers/uploadControllers');
// const multer = require('multer');
// const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

// router.use(errorHandlingMiddleware);


// // Set up multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Routes
// router.post('/', upload.single('file'), uploadController.newContestant); 
// router.get('/', uploadController.getAllContestants);
// router.post('/vote/:actorId', uploadController.recordVote); 
// router.get('/:actorId', uploadController.getContestantById);
// router.delete('/:actorId', uploadController.deleteContestant);


// module.exports = router;
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadControllers');
const multer = require('multer');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    // Your route logic here
    await uploadController.newContestant(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    // Your route logic here
    await uploadController.getAllContestants(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.post('/vote/:actorId', async (req, res, next) => {
  try {
    // Your route logic here
    await uploadController.recordVote(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.get('/:actorId', async (req, res, next) => {
  try {
    // Your route logic here
    await uploadController.getContestantById(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

router.delete('/:actorId', async (req, res, next) => {
  try {
    // Your route logic here
    await uploadController.deleteContestant(req, res);
  } catch (error) {
    // Call the error handling middleware
    next(error);
  }
});

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
