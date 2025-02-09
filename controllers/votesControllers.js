// const knex = require("knex")(require("../knexfile"));

// const userExpirations = new Map();

// exports.castVote = async (req, res, next) => {
//   const trx = await knex.transaction();

//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Step 1: Check if the user has already voted for the contestant
//     const existingVote = await trx("votes")
//       .where({ user_id: userId, contestant_id: contestantId })
//       .first();

//     if (existingVote && userExpirations.has(userId)) {
//       const expirationTime = userExpirations.get(userId);
//       if (expirationTime > Date.now()) {
//         // If the vote is not expired, return error
//         console.log(`User ${userId} attempted to vote again before expiration.`);
//         await trx.rollback();
//         return res.status(400).json({
//           error: "User has already voted",
//           message: "User can only vote once per 24 hours.",
//         });
//       } else {
//         // Step 2: If the vote is expired, delete the old vote
//         await trx("votes")
//           .where({ user_id: userId, contestant_id: contestantId })
//           .del();
//         userExpirations.delete(userId);
//       }
//     }

//     // Step 3: Reset user's expiration time to 24 hours from now
//     const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//     userExpirations.set(userId, expirationTime);

//     // Step 4: Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await trx("votes").insert(votesToInsert);
//     await trx.commit();

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     await trx.rollback();
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Periodically clean up expired votes
// setInterval(async () => {
//   const now = Date.now();
//   console.log("Running cleanup interval", { now });

//   for (const [userId, expirationTime] of userExpirations.entries()) {
//     if (expirationTime <= now) {
//       console.log(`Removing expired vote for user ${userId}.`);
//       userExpirations.delete(userId);

//       try {
//         await knex("votes")
//           .where({ user_id: userId })
//           .del();
//         console.log(`Expired vote for user ${userId} deleted from the database.`);
//       } catch (error) {
//         console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
//       }
//     }
//   }
// }, 24 * 60 * 60 * 1000); // Run every 24 hours to clean up expired votes

const knex = require("knex")(require("../knexfile"));


const userExpirations = new Map();

exports.castVote = async (req, res, next) => {
  const trx = await knex.transaction();

  try {
    const { userId, contestantId, numberOfVotes } = req.body;

    // Step 1: Check if the user is currently blocked from voting
    if (userExpirations.has(userId)) {
      const expirationTime = userExpirations.get(userId);
      if (expirationTime > Date.now()) {
        console.log(`User ${userId} attempted to vote again before expiration.`);
        await trx.rollback();
        return res.status(400).json({
          error: "User is temporarily blocked",
          message: "You can only vote once every 24 hours.",
        });
      } else {
        // Clear the expired block
        userExpirations.delete(userId);
      }
    }

    // Step 2: Reset user's expiration time to 24 hours from now
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    userExpirations.set(userId, expirationTime);

    // Step 3: Insert a new vote record for each vote
    const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
      user_id: userId,
      contestant_id: contestantId,
    }));

    await trx("votes").insert(votesToInsert);
    await trx.commit();

    console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
    res.status(201).json({ message: "Votes cast successfully" });
  } catch (error) {
    await trx.rollback();
    console.error(`Error in castVote controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error." });
  }
};

// Periodically clean up expired blocks
setInterval(() => {
  const now = Date.now();
  for (const [userId, expirationTime] of userExpirations.entries()) {
    if (expirationTime <= now) {
      console.log(`Removing expired block for user ${userId}.`);
      userExpirations.delete(userId);
    }
  }
}, 24 * 60 * 60 * 1000); // Clean up every 24 hours
