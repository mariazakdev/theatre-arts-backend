const logger = require("../logger");
const knex = require("knex")(require("../knexfile"));

exports.loginUser = async (req, res, next) => {
  try {
    const { email, firebaseId } = req.body;

    const user = await knex("users")
      .where({ email, firebase_auth_id: firebaseId })
      .first();

    if (user) {
      res.status(200).json({ userId: user.id, message: "User logged in successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error(`Error in loginUser controller: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const firebaseUid = req.params.userId;

    const user = await knex("users")
      .where({ firebase_auth_id: firebaseUid })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const contestant = await knex("contestants")
      .where({ user_id: user.id })
      .first();

    if (!contestant) {
      return res.status(200).json({ message: "User is not a contestant", user });
    }

    const responseData = {
      contestant,
      user,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    logger.error(`Error in getUserById controller: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteUserByFirebaseId = async (req, res, next) => {
  try {
    const firebaseUid = req.params.firebaseId;

    const user = await knex("users")
      .where({ firebase_auth_id: firebaseUid })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await knex('votes_tracker').where({ user_id: user.id }).del();
    await knex("contestants").where({ user_id: user.id }).del();
    await knex("users").where({ id: user.id }).del();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error in deleteUserByFirebaseId controller: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal server error." });
  }
};

// exports.createUser = async (req, res, next) => {
//   try {
//     const { email, firebaseAuthId, isContestant } = req.body;
//     const newUser = {
//       firebase_auth_id: firebaseAuthId,
//       email: email,
//       is_contestant: isContestant,
//     };

//     const [userId] = await knex("users").insert(newUser);

//     res.status(201).json({ userId: userId, message: "User created successfully" });
//   } catch (error) {
//     logger.error(`Error in createUser: ${error.message}`, { stack: error.stack, requestId: req.id });
//     next(error);
//   }
// };
exports.createUser = async (req, res, next) => {
  try {
    const { email, firebaseAuthId, isContestant } = req.body;

    // Check if user already exists
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const newUser = {
      firebase_auth_id: firebaseAuthId,
      email: email,
      is_contestant: isContestant,
    };

    const [userId] = await knex("users").insert(newUser);

    res.status(201).json({ userId: userId, message: "User created successfully" });
  } catch (error) {
    logger.error(`Error in createUser: ${error.message}`, { stack: error.stack, requestId: req.id });
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await knex("users").select("*");
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error.message}`, { stack: error.stack, requestId: req.id });
    next(error);
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await knex("users").where("email", email).first();

    if (!user) {
      return res.status(200).json({ userExists: false });
    }

    res.status(200).json({ userExists: true, user });
  } catch (error) {
    logger.error("Error retrieving user by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserHasPaid = async (req, res, next) => {
  try {
    const firebaseId = req.params.firebaseId;
    await knex("users")
      .where({ firebase_auth_id: firebaseId })
      .update({ hasPaid: 1 });

    res.status(200).json({ message: "User's hasPaid field updated successfully" });
  } catch (error) {
    logger.error("Error updating user's hasPaid field:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserUploadStatus = async (req, res, next) => {
  try {
    const firebaseId = req.params.firebaseId;
    await knex("users")
      .where({ firebase_auth_id: firebaseId })
      .update({ uploadStatus: 1 });

    res.status(200).json({ message: "User's upload status updated successfully" });
  } catch (error) {
    logger.error("Error updating user's upload status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.sendErrorResponse = (res) => {
  const statusCode = 500;
  const errorImageUrl = `https://http.cat/${statusCode}`;
  res.status(statusCode).json({
    error: "Server Issues. Message from backend 'Users'",
    errorUrl: errorImageUrl,
  });
};
