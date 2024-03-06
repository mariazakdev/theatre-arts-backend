const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadControllers');
const errorHandlingMiddleware = require('../middlewares/errorHandlingMiddleware');

router.post('/', async (req, res, next) => {
  try {  
    await uploadController.newContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res, next) => {

  try {
    await uploadController.getAllContestants(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/:actorId', async (req, res, next) => {
  try {
    await uploadController.updateContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/vote/:actorId', async (req, res, next) => {
  try {
    await uploadController.recordVote(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/reset-votes/:actorId', async (req, res, next) => {
  try {
    await uploadController.resetVotes(req, res); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/:actorId', async (req, res, next) => {
  try {
    await uploadController.getContestantById(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route for updating active status
router.put('/active/:actorId', async (req, res, next) => {
  try {
    await uploadController.updateContestantActiveStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:actorId', async (req, res, next) => {
  try {
    await uploadController.deleteContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.use(errorHandlingMiddleware);

module.exports = router;
