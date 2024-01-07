const express = require('express');
const router = express.Router();
const sunKingController = require('../controllers/sunKingControllers');

// GET Sun King data
router.get('/', async (req, res) => {
  try {
    const sunKingData = await sunKingController.getSunKingData();
    res.json(sunKingData);
  } catch (error) {
    console.error('Error fetching Sun King data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT (Update) Sun King data
router.put('/', async (req, res) => {
  try {
    const { newData } = req.body;
    await sunKingController.updateSunKingData(newData);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating Sun King data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
