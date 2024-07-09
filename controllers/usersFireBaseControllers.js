const { Console } = require("console");

const knex = require("knex")(require("../knexfile"));

exports.loginUser = async (req, res, next) => {
  try {
    const { email, firebaseId } = req.body;

    // // Use the provided email to find the user in the database
    const user = await knex("users")
      .where({ email, firebase_auth_id: firebaseId })
      .first();

    if (user) {
      // Respond with a 200 status and user ID on successful login
      res
        .status(200)
        .json({ userId: user.id, message: "User logged in successfully" });
    } else {
      // Respond with a 404 status if the user is not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    // Respond with a 500 status for internal server error
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const firebaseUid = req.params.userId;

    // Use the provided Firebase UID to find the user in the database
    const user = await knex("users")
      .where({ firebase_auth_id: firebaseUid })
      .first();

    if (!user) {
      // Respond with a 404 status if the user is not found
      return res.status(404).json({ error: "User not found" });
    }

    // Find matching user_id in contestants table
    const contestant = await knex("contestants")
      .where({ user_id: user.id })
      .first();

    if (!contestant) {
      // Respond with a 200 status and a message indicating no contestant found
      return res
        .status(200)
        .json({ message: "User is not a contestant", user });
    }

    const responseData = {
      contestant,
      user,
    };

    // Respond with a 200 status and user details along with the associated contestant on success
    return res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error in loginUser controller: ${error.message}`, {
      stack: error.stack,
    });
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteUserByFirebaseId = async (req, res, next) => {
  try {
    const firebaseUid = req.params.firebaseId;

    // Use the provided Firebase UID to find the user in the database
    const user = await knex("users")
      .where({ firebase_auth_id: firebaseUid })
      .first();

    if (!user) {
      // Respond with a 404 status if the user is not found
      return res.status(404).json({ error: "User not found" });
    } 
    await knex('votes_tracker').where({ user_id: user.id }).del();

    await knex('votes_tracker').where({ user_id: user.id }).del();
    await knex("contestants").where({ user_id: user.id }).del();
   

    // Delete the user by their ID
    await knex("users").where({ id: user.id }).del();

    // Respond with a 200 status and a message indicating successful deletion
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(
      `Error in deleteUserByFirebaseId controller: ${error.message}`,
      { stack: error.stack }
    );
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, firebaseAuthId, isContestant } = req.body;
    const newUser = {
      firebase_auth_id: firebaseAuthId,
      email: email,
      is_contestant: isContestant,
    };

    // The 'newUser' object should not be a string
    const [userId] = await knex("users").insert(newUser);

    // Status 201 is more appropriate for a successful creation of a resource
    res
      .status(201)
      .json({ userId: userId, message: "User created successfully" });
  } catch (error) {
    logger.error(`Error in createUser: ${error.message}`, {
      stack: error.stack,
      requestId: req.id,
    });

    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await knex("users").select("*");
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error.message}`, {
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
};



exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Query the database to find the user by email
    const user = await knex("users").where("email", email).first();

    if (!user) {
      // If user not found, return 200 status with userExists flag set to false
      return res.status(200).json({ userExists: false });
    }

    // If user found, return 200 status with user details
    res.status(200).json({ userExists: true, user });
  } catch (error) {
    console.error("Error retrieving user by email:", error);
    // If an error occurs, return 500 status and error message
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.updateUserHasPaid = async (req, res, next) => {
  try {
    const firebaseId = req.params.firebaseId; 
    // Update the hasPaid field for the user with the provided firebaseId
    await knex("users")
      .where({ firebase_auth_id: firebaseId })
      .update({ hasPaid: 1 }); // Set hasPaid to 1 for the user
    // Respond with a success message
    res.status(200).json({ message: "User's hasPaid field updated successfully" });
  } catch (error) {
    console.error("Error updating user's hasPaid field:", error);
    // Respond with an error message
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserUploadStatus = async (req, res, next) => {
  try {
    const firebaseId = req.params.firebaseId; 
    // Update the uploadStatus field for the user with the provided userId
    await knex("users")
    .where({ firebase_auth_id: firebaseId })
    .update({ uploadStatus: 1 }); // Set uploadStatus to 1 for the user
    // Respond with a success message
    res.status(200).json({ message: "User's upload status updated successfully" });
  } catch (error) {
    console.error("Error updating user's upload status:", error);
    // Respond with an error message
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
