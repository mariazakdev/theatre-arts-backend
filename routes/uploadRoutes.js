const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadControllers");
const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

router.post("/", async (req, res, next) => {
  try {
    await uploadController.newContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    await uploadController.getAllContestants(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:actorId", async (req, res, next) => {
  try {
    await uploadController.updateContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/contestants/:actorId/thankyou", async (req, res, next) => {
  try {
    await uploadController.getContestantThankYouInfo(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/vote/:actorId", async (req, res, next) => {
  try {
    await uploadController.recordVote(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/vote-extra/:actorId", async (req, res, next) => {
  try {
    await uploadController.recordExtraVote(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/:actorId", async (req, res, next) => {
  try {
    await uploadController.getContestantById(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////// Admin Tech small updates /////////////////////
router.put("/:actorId/update-photo", uploadController.updatePhoto);
router.put("/:actorId/update-video", uploadController.updateVideo);
router.put("/:actorId/update-description", uploadController.updateDescription);
router.put("/:actorId/update-name", async (req, res, next) => {
  try {
    await uploadController.updateName(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New route for updating active status
router.put("/active/:actorId", async (req, res, next) => {
  try {
    await uploadController.updateContestantActiveStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:contestantId", async (req, res, next) => {
  try {
    await uploadController.deleteContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Route to set active status of all users to 1
router.put("/activate-all", async (req, res, next) => {
  try {
    // Call the controller function to update active status
    await uploadController.activateAllContestants(req, res);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:actorId/submit-video", uploadController.submitVideo);

router.put("/:actorId/update-round", async (req, res, next) => {
  try {
    await uploadController.updateRoundNumberManually(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:actorId/update-group", async (req, res, next) => {
  try {
    await uploadController.updateGroupNumberManually(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//////// IT Tech Routes ////////////

// Deactivate all contestants except the top 3 in each group
// STEP 1 towards the end 
router.put('/deactivate-non-ranked', async (req, res, next) => {
  try {
    await uploadController.deactivateNonTopThree(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove all votes. Start at zero
// STEP 2 towards the end
router.put("/reset-votes", async (req, res, next) => {
  try {
    await uploadController.resetVotes(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Regroup new set of active contestants
// STEP 3 towards the end
router.put('/regroup-contestants', async (req, res, next) => {
  try {
    await uploadController.regroupActiveContestants(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New round
// STEP 4 towards the end
router.put('/update-round', async (req, res, next) => {
  try {
    await uploadController.updateRoundForActiveContestants(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Update votes for testing only

router.put('/:contestantId/update-votes', async (req, res, next) => {
  try {
    await uploadController.updateVotesForContestant(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.use(errorHandlingMiddleware);

module.exports = router;
