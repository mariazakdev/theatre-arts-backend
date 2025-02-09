const express = require('express');
const router = express.Router();
const votesTrackerController = require('../controllers/votesTrackerControllers');

router.post('/', votesTrackerController.createVoteTracker);
router.get('/', votesTrackerController.getVoteTrackers);
router.get('/contestant/:contestantId', votesTrackerController.getVotesForContestant);
router.put('/reset-vote-tracker-history', votesTrackerController.resetVoteTrackerHistory);

module.exports = router;