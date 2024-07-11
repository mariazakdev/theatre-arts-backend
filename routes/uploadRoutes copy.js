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


router.put("/reset-votes", async (req, res, next) => {
  try {
    await uploadController.resetVotes(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.put("/update-round", async (req, res, next) => {
  try {
    await uploadController.updateRound(req, res);
    (req, res);
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
// router.put("/:actorId/update-round", uploadController.updateRound);
// router.put("/:actorId/update-group", uploadController.updateGroup);


// router.put("/:actorId/update-group", async (req, res, next) => {
//   try {
//     await uploadController.updateGroupNumberManually(req, res);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
router.post('/regroup', uploadController.incrementRoundAndRegroup);


router.use(errorHandlingMiddleware);

module.exports = router;
