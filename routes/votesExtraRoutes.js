const express = require("express");
const router = express.Router();
const votesController = require("../controllers/votesExtraControllers");
const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

router.post("/", async (req, res, next) => {
  try {
    await votesController.castExtraVote(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
