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
router.put("/:actorId/update-round", uploadController.updateRound);

router.put("/update-groups", async (req, res, next) => {
  try {
    await uploadController.updateGroups(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/update-groups", async (req, res, next) => {
  try {
    await uploadController.updateGroups(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update contestant groups
exports.updateGroups = async (req, res, next) => {
  const { groupedContestants } = req.body;

  if (!groupedContestants || !Array.isArray(groupedContestants)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const transaction = await knex.transaction();

  try {
    for (const group of groupedContestants) {
      const { groupId, contestantIds } = group;
      if (!groupId || !Array.isArray(contestantIds)) {
        return res.status(400).json({ error: "Invalid group data" });
      }

      // Update group number for each contestant in the group
      for (const id of contestantIds) {
        await knex('contestants')
          .transacting(transaction)
          .where({ id })
          .update({ group: groupId });
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Groups updated successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in updateGroups controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};



router.use(errorHandlingMiddleware);

module.exports = router;