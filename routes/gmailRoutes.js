// routes/authRoutes.js
const express = require('express');
const { googleLogin } = require('../controllers/gmailControllers');
const router = express.Router();

router.post('/google-login', googleLogin);

module.exports = router;
// https://www.youtube.com/watch?v=9d3L3kYjxSQ