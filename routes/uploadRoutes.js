const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

router.post('/', async (req, res, next) => {
  try {  
    await uploadController.newContestant(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {

  try {
    await uploadController.getAllContestants(req, res);
  } catch (error) {
    next(error);
  }
});



router.post('/:actorId', async (req, res, next) => {
  try {
    await uploadController.updateContestant(req, res);
  } catch (error) {
    next(error);
  }
});


router.post('/vote/:actorId', async (req, res, next) => {
  try {
    await uploadController.recordVote(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:actorId', async (req, res, next) => {
  try {
    await uploadController.getContestantById(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:actorId', async (req, res, next) => {
  try {
    await uploadController.deleteContestant(req, res);
  } catch (error) {
    next(error);
  }
});


router.use(errorHandlingMiddleware);

module.exports = router;
