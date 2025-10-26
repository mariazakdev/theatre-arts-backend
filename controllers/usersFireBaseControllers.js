const logger = require("../logger");
const knex = require("knex")(require("../knexfile"));

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, firebaseId } = req.body;

//     const user = await knex("users")
//       .where({ email, firebase_auth_id: firebaseId })
//       .first();

//     if (user) {
//       res.status(200).json({ userId: user.id, message: "User logged in successfully" });
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error('Database error in loginUser:', error.message);

//     // Handle connection errors
//     if (error.code === 'ECONNRESET') {
//       return res.status(503).json({ message: "Connection was reset. Please try again later." });
//     }

//     res.status(500).json({ message: "Internal server error." });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    // minimal normalization
    const email = String(req.body.email || "").trim().toLowerCase();
    const firebaseId = req.body.firebaseId;

    if (!email || !firebaseId) {
      return res.status(400).json({ message: "email and firebaseId are required" });
    }

    // 1) Try by UID first (fast path)
    let user = await knex("users")
      .where({ firebase_auth_id: firebaseId })
      .first();

    // 2) Fallback for legacy rows: find by email, then backfill UID
    if (!user) {
      const byEmail = await knex("users").where({ email }).first();
      if (byEmail) {
        await knex("users")
          .where({ id: byEmail.id })
          .update({ firebase_auth_id: firebaseId });
        user = { ...byEmail, firebase_auth_id: firebaseId };
      }
    }

    if (user) {
      return res
        .status(200)
        .json({ userId: user.id, message: "User logged in successfully" });
    }

    // keep your old contract (404) to avoid breaking callers
    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Database error in loginUser:", error.message);
    if (error.code === "ECONNRESET") {
      return res
        .status(503)
        .json({ message: "Connection was reset. Please try again later." });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.createUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const firebaseAuthId = req.body.firebaseAuthId || req.body.firebaseId;

    if (!email || !firebaseAuthId) {
      return res.status(400).json({ message: "email and firebaseAuthId are required" });
    }

    const existingByEmail = await knex("users").where({ email }).first();
    if (existingByEmail) {
      // If they exist but were missing firebase_auth_id, fix it
      if (!existingByEmail.firebase_auth_id) {
        await knex("users")
          .where({ id: existingByEmail.id })
          .update({ firebase_auth_id: firebaseAuthId });
        return res.status(200).json({ userId: existingByEmail.id, message: "User updated with firebase_auth_id" });
      }
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const [userId] = await knex("users").insert({
      firebase_auth_id: firebaseAuthId,
      email,
      is_contestant: !!req.body.isContestant
    });

    return res.status(201).json({ userId, message: "User created successfully" });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.getUserById = async (req, res) => {
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

    return res.status(200).json({ contestant, user });
  } catch (error) {
    console.error('Database error in getUserById:', error.message);

    if (error.code === 'ECONNRESET') {
      return res.status(503).json({ message: "Database connection was reset. Please try again later." });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteUserByFirebaseId = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const firebaseUid = req.params.firebaseId;

    const user = await trx("users")
      .where({ firebase_auth_id: firebaseUid })
      .first();

    if (!user) {
      await trx.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    const placeholderUserId = 1; // Ensure this ID exists in the `users` table

    // Update votes and delete user in a transaction
    await trx("votes_tracker")
      .where({ user_id: user.id })
      .update({ user_id: placeholderUserId });

    await trx("contestants")
      .where({ user_id: user.id })
      .del();

    await trx("users")
      .where({ id: user.id })
      .del();

    await trx.commit();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    await trx.rollback();
    console.error('Error in deleteUserByFirebaseId:', error.message);

    if (error.code === 'ECONNRESET') {
      return res.status(503).json({ message: "Database connection was reset. Please try again later." });
    }

    res.status(500).json({ message: "Internal server error." });
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
