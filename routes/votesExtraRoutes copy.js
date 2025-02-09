// const express = require("express");
// const router = express.Router();
// const votesController = require("../controllers/votesExtraControllers");
// const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

// // Route to check vote eligibility (dry-run)
// router.post("/check-vote-eligibility", async (req, res, next) => {
//   try {
//     await votesController.checkVoteEligibility(req, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

// router.post("/", async (req, res, next) => {
//   try {
//     await votesController.castExtraVote(req, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });


// // Error handling middleware
// router.use(errorHandlingMiddleware);

// module.exports = router;

const express = require("express");
const router = express.Router();
const votesController = require("../controllers/votesExtraControllers");
const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

// Route to check vote eligibility (dry-run)
router.post("/check-vote-eligibility", async (req, res, next) => {
  try {
    console.log("Received request to /check-vote-eligibility with data:", req.body);
    await votesController.checkVoteEligibility(req, res);
    console.log("Response sent successfully for /check-vote-eligibility");
  } catch (error) {
    console.error("Error in /check-vote-eligibility:", error);
    next(error); // Pass error to middleware
  }
});

// Route to cast extra vote
router.post("/", async (req, res, next) => {
  try {
    console.log("Received request to /votes with data:", req.body);
    await votesController.castExtraVote(req, res);
    console.log("Response sent successfully for /votes");
  } catch (error) {
    console.error("Error in /votes:", error);
    next(error); // Pass error to middleware
  }
});

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
