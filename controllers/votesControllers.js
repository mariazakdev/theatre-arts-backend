// const knex = require("knex")(require("../knexfile"));

// // Store a map of user IDs to expiration times
// const userExpirations = new Map();

// exports.castVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has already voted and their vote is expired
//     const existingVote = await knex("votes")
//       .where({ user_id: userId })
//       .first();

//     if (existingVote && userExpirations.has(userId)) {
//       const expirationTime = userExpirations.get(userId);
//       if (expirationTime > Date.now()) {
//         // If the vote is not expired, return error
//         console.log(`User ${userId} attempted to vote again before expiration.`);
//         return res.status(400).json({
//           error: "User has already voted",
//           message: "User can only vote once per 24 hours",
//         });
//       }
//     }

//     // Reset user's expiration time to 24 hours from now
//     const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
//     // const expirationTime = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds // Temporarily set to 5 minutes for testing

//     userExpirations.set(userId, expirationTime);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Periodically clean up expired votes
// setInterval(() => {
//   const now = Date.now();
//   for (const [userId, expirationTime] of userExpirations.entries()) {
//     if (expirationTime <= now) {
//       // If the expiration time has passed, remove the user ID
//       console.log(`Removing expired vote for user ${userId}.`);
//       userExpirations.delete(userId);
//       // Delete the user's vote from the database
//       knex("votes")
//         .where({ user_id: userId })
//         .del()
//         .then(() => {
//           console.log(`Expired vote for user ${userId} deleted from the database.`);
//         })
//         .catch(error => {
//           console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
//         });
//     }
//   }
// }, 24 * 60 * 60 * 1000); // Run every 24 hours to clean up expired votes
// // }, 5 * 60 * 1000); // Run every 5 minutes to clean up expired votes  // Temporarily set to 5 minutes for testing


// const knex = require("knex")(require("../knexfile"));

// // Store a map of user IDs to expiration times
// const userExpirations = new Map();

// exports.castVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has already voted and their vote is expired
//     const existingVote = await knex("votes")
//       .where({ user_id: userId })
//       .first();

//     if (existingVote && userExpirations.has(userId)) {
//       const expirationTime = userExpirations.get(userId);
//       if (expirationTime > Date.now()) {
//         // If the vote is not expired, return error
//         console.log(`User ${userId} attempted to vote again before expiration.`);
//         return res.status(400).json({
//           error: "User has already voted",
//           message: "User can only vote once per 24 hours",
//         });
//       }
//     }

//     // Reset user's expiration time to 24 hours from now
//     // const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
//     const expirationTime = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds // Temporarily set to 10 minutes for testing

//     userExpirations.set(userId, expirationTime);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Periodically clean up expired votes
// setInterval(() => {
//   const now = Date.now();
//   for (const [userId, expirationTime] of userExpirations.entries()) {
//     if (expirationTime <= now) {
//       // If the expiration time has passed, remove the user ID
//       console.log(`Removing expired vote for user ${userId}.`);
//       userExpirations.delete(userId);
//       // Delete the user's vote from the database
//       knex("votes")
//         .where({ user_id: userId })
//         .del()
//         .then(() => {
//           console.log(`Expired vote for user ${userId} deleted from the database.`);
//         })
//         .catch(error => {
//           console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
//         });
//     }
//   }
// // }, 24 * 60 * 60 * 1000); // Run every 24 hours to clean up expired votes
// }, 5 * 60 * 1000); // Run every 5 minutes to clean up expired votes  // Temporarily set to 10 minutes for testing


// exports.castExtraVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has already voted and their vote is expired
//     const existingVote = await knex("votes")
//       .where({ user_id: userId })
//       .first();

//     if (existingVote && userExpirations.has(userId)) {
//       const expirationTime = userExpirations.get(userId);
//       if (expirationTime > Date.now()) {
//         // If the vote is not expired, return error
//         console.log(`User ${userId} attempted to vote again before expiration.`);
//         return res.status(400).json({
//           error: "User has already voted",
//           message: "User can only vote once per 3 days if voted with paid votes, and once per 24 hours if voted with free votes.",
//         });
//       }
//     }

//     // Reset user's expiration time to 24 hours from now
//     // const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
//     const expirationTime = Date.now() + (10 * 60 * 1000); // 10 minutes in milliseconds // Temporarily set to 10 minutes for testing

//     userExpirations.set(userId, expirationTime);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Periodically clean up expired votes
// setInterval(() => {
//   const now = Date.now();
//   for (const [userId, expirationTime] of userExpirations.entries()) {
//     if (expirationTime <= now) {
//       // If the expiration time has passed, remove the user ID
//       console.log(`Removing expired vote for user ${userId}.`);
//       userExpirations.delete(userId);
//       // Delete the user's vote from the database
//       knex("votes")
//         .where({ user_id: userId })
//         .del()
//         .then(() => {
//           console.log(`Expired vote for user ${userId} deleted from the database.`);
//         })
//         .catch(error => {
//           console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
//         });
//     }
//   }
// // }, 3 * 24 * 60 * 60 * 1000); // Run every 3 days to clean up expired votes
// }, 10 * 60 * 1000); // Run every 10 minutes to clean up expired votes  // Temporarily set to 10 minutes for testing

const knex = require("knex")(require("../knexfile"));

// Store a map of user IDs to cooldown expiration times for each type of vote
const userCooldowns = new Map();

exports.castVote = async (req, res, next) => {
  try {
    const { userId, contestantId, numberOfVotes } = req.body;

    // Check if the user has a cooldown for castVote
    if (userCooldowns.has(userId) && userCooldowns.get(userId).castVote > Date.now()) {
      // If the cooldown for castVote is active, return error
      console.log(`User ${userId} attempted to cast vote before cooldown expiration for castVote.`);
      return res.status(400).json({
        error: "User has a cooldown",
        message: "You can vote once every 24 hours.",
      });
    }

    // Set the cooldown time for castVote to 24 hours from now
    const castVoteCooldown = Date.now() + (24 * 60 * 60 * 1000);
    const userCooldown = userCooldowns.get(userId) || {};
    userCooldown.castVote = castVoteCooldown;
    userCooldowns.set(userId, userCooldown);

    // Insert a new vote record for each vote
    const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
      user_id: userId,
      contestant_id: contestantId,
    }));

    await knex("votes").insert(votesToInsert);

    console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId} in castVote.`);
    res.status(201).json({ message: "Votes cast successfully" });
  } catch (error) {
    console.error(`Error in castVote controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.castExtraVote = async (req, res, next) => {
  try {
    const { userId, contestantId, numberOfVotes } = req.body;

    // Check if the user has a cooldown for castExtraVote
    if (userCooldowns.has(userId) && userCooldowns.get(userId).castExtraVote > Date.now()) {
      // If the cooldown for castExtraVote is active, return error
      console.log(`User ${userId} attempted to cast vote before cooldown expiration for castExtraVote.`);
      return res.status(400).json({
        error: "User has a cooldown",
        message: "You can add multiple votes once every 3 days.",
      });
    }

    // Set the cooldown time for castExtraVote to 3 days from now
    const castExtraVoteCooldown = Date.now() + (3 * 24 * 60 * 60 * 1000);
    const userCooldown = userCooldowns.get(userId) || {};
    userCooldown.castExtraVote = castExtraVoteCooldown;
    userCooldowns.set(userId, userCooldown);

    // Insert a new vote record for each vote
    const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
      user_id: userId,
      contestant_id: contestantId,
    }));

    await knex("votes").insert(votesToInsert);

    console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId} in castExtraVote.`);
    res.status(201).json({ message: "Votes cast successfully" });
  } catch (error) {
    console.error(`Error in castExtraVote controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error." });
  }
};

// Periodically clean up expired cooldowns
setInterval(() => {
  const now = Date.now();
  for (const [userId, cooldowns] of userCooldowns.entries()) {
    if (cooldowns.castVote && cooldowns.castVote <= now) {
      // If the castVote cooldown has expired, remove it
      console.log(`Removing expired cooldown for castVote for user ${userId}.`);
      delete cooldowns.castVote;
    }
    if (cooldowns.castExtraVote && cooldowns.castExtraVote <= now) {
      // If the castExtraVote cooldown has expired, remove it
      console.log(`Removing expired cooldown for castExtraVote for user ${userId}.`);
      delete cooldowns.castExtraVote;
    }
    // If no more cooldowns exist for this user, remove the user from userCooldowns
    if (Object.keys(cooldowns).length === 0) {
      userCooldowns.delete(userId);
    }
  }
}, 10 * 60 * 1000); // Run every 10 minutes to clean up expired cooldowns