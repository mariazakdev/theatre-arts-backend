const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const votesController = require('../controllers/paymentVotesControllers');

router.post('/', votesController.paidVotes);
router.get('/', (req, res) => {
    res.json("Hello from GET /votes");
});

module.exports = router;