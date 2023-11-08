const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile'));
const authenticateFirebaseUser = require('../middlewares/authenticateFirebaseUser'); 
const dashboardController = require('../controllers/dashboardControllers');

router.get('/', authenticateFirebaseUser, dashboardController.getUserDashboard);


module.exports = router;