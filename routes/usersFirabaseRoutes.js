const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

const usersController = require("../controllers/usersFireBaseControllers");
const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");
const { getUserById } = require("../controllers/usersFireBaseControllers");

router.post("/login", async (req, res, next) => {
  try {
    // Your route logic here
    await usersController.loginUser(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/:userId", usersController.getUserById);

router.get("/", async (req, res, next) => {
  try {
    await usersController.getAllUsers(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/", async (req, res, next) => {
  try {
    await usersController.createUser(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route to get a user by email address
router.get("/email/:email", usersController.getUserByEmail);
router.delete("/:firebaseId", usersController.deleteUserByFirebaseId);
router.put("/updateHasPaid/:firebaseId", usersController.updateUserHasPaid);
router.put("/upload-status/:firebaseId", usersController.updateUserUploadStatus);

// Error handling middleware
router.use(errorHandlingMiddleware);

module.exports = router;
