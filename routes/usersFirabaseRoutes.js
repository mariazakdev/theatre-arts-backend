const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersFireBaseControllers');

router.get('/', usersController.getAllUsers); 
router.post('/', usersController.createUser);
router.get('/check-user', usersController.checkUserExistence);


module.exports = router; 