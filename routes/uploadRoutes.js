const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadControllers');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/', upload.single('file'), uploadController.uploadData); 
router.get('/', uploadController.getAllContestants);

module.exports = router;
