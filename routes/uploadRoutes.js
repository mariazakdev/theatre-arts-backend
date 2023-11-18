const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadControllers');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/', upload.single('file'), uploadController.newContestant); 
router.get('/', uploadController.getAllContestants);
router.post('/vote/:actorId', uploadController.recordVote); 
router.get('/:actorId', uploadController.getContestantById);


module.exports = router;
