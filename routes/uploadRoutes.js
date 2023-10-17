const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Routes
router.post('/', uploadController.uploadData);
router.get('/', uploadController.getAllContestants);


module.exports = router;
