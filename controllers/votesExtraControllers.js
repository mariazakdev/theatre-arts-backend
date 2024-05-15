const knex = require("knex")(require("../knexfile"));

// Store a map of user IDs to expiration times
const userExpirations = new Map();

exports.castVote = async (req, res, next) => {
  try {
    const { userId, contestantId, numberOfVotes } = req.body;

    // Check if the user has already voted and their vote is expired
    const existingVote = await knex("votes")
      .where({ user_id: userId })
      .first();

    if (existingVote && userExpirations.has(userId)) {
      const expirationTime = userExpirations.get(userId);
      if (expirationTime > Date.now()) {
        // If the vote is not expired, return error
        console.log(`User ${userId} attempted to vote again before expiration.`);
        return res.status(400).json({
          error: "User has already voted",
          message: "User can only vote once per 3 days for extra votes",
        });
      }
    }

    // Reset user's expiration time to 24 hours from now
    const expirationTime = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
    // const expirationTime = Date.now() + (10 * 60 * 1000); // 10 minutes in milliseconds // Temporarily set to 10 minutes for testing

    userExpirations.set(userId, expirationTime);

    // Insert a new vote record for each vote
    const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
      user_id: userId,
      contestant_id: contestantId,
    }));

    await knex("votes").insert(votesToInsert);

    console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
    res.status(201).json({ message: "Votes cast successfully" });
  } catch (error) {
    console.error(`Error in castVote controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error." });
  }
};

// Periodically clean up expired votes
setInterval(() => {
  const now = Date.now();
  for (const [userId, expirationTime] of userExpirations.entries()) {
    if (expirationTime <= now) {
      // If the expiration time has passed, remove the user ID
      console.log(`Removing expired vote for user ${userId}.`);
      userExpirations.delete(userId);
      // Delete the user's vote from the database
      knex("votes")
        .where({ user_id: userId })
        .del()
        .then(() => {
          console.log(`Expired vote for user ${userId} deleted from the database.`);
        })
        .catch(error => {
          console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
        });
    }
  }
}, 3 * 24 * 60 * 60 * 1000); // Run every 3 days to clean up expired votes
// }, 10 * 60 * 1000); // Run every 10 minutes to clean up expired votes  // Temporarily set to 10 minutes for testing