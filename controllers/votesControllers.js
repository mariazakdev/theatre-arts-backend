// const knex = require("knex")(require("../knexfile"));

// // Store a map of user IDs to cooldown expiration times for each type of vote
// const userCooldowns = new Map();

// exports.castVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has a cooldown for castVote
//     if (userCooldowns.has(userId) && userCooldowns.get(userId).castVote > Date.now()) {
//       // If the cooldown for castVote is active, return error
//       console.log(`User ${userId} attempted to cast vote before cooldown expiration for castVote.`);
//       return res.status(400).json({
//         error: "User has a cooldown",
//         message: "You can vote once every 24 hours.",
//       });
//     }

//     // Set the cooldown time for castVote to 24 hours from now
//     const castVoteCooldown = Date.now() + (24 * 60 * 60 * 1000);
//     const userCooldown = userCooldowns.get(userId) || {};
//     userCooldown.castVote = castVoteCooldown;
//     userCooldowns.set(userId, userCooldown);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId} in castVote.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };
// exports.castExtraVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has a cooldown for castExtraVote
//     if (userCooldowns.has(userId) && userCooldowns.get(userId).castExtraVote > Date.now()) {
//       // If the cooldown for casExtraVote is active, return error
//       console.log(`User ${userId} attempted to cast vote before cooldown expiration for castExtraVote.`);
//       return res.status(400).json({
//         error: "User has a cooldown",
//         message: "You can vote once every 3 days.",
//       });
//     }

//     // Set the cooldown time for castExtraVote to 3 days from now
//     const castExtraVoteCooldown = Date.now() + (3* 24 * 60 * 60 * 1000);
//     const userCooldown = userCooldowns.get(userId) || {};
//     userCooldown.castExtraVote = castExtraVoteCooldown;
//     userCooldowns.set(userId, userCooldown);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId} in castVote.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };
// };

// // Periodically clean up expired cooldowns
// setInterval(() => {
//   const now = Date.now();
//   for (const [userId, cooldowns] of userCooldowns.entries()) {
//     if (cooldowns.castVote && cooldowns.castVote <= now) {
//       // If the castVote cooldown has expired, remove it
//       console.log(`Removing expired cooldown for castVote for user ${userId}.`);
//       delete cooldowns.castVote;
//     }
//     if (cooldowns.castExtraVote && cooldowns.castExtraVote <= now) {
//       // If the castExtraVote cooldown has expired, remove it
//       console.log(`Removing expired cooldown for castExtraVote for user ${userId}.`);
//       delete cooldowns.castExtraVote;
//     }
//     // If no more cooldowns exist for this user, remove the user from userCooldowns
//     if (Object.keys(cooldowns).length === 0) {
//       userCooldowns.delete(userId);
//     }
//   }
// }, 10 * 60 * 1000); // Run every 10 minutes to clean up expired cooldowns







// const knex = require("knex")(require("../knexfile"));

// // Store a map of user IDs to cooldown expiration times for each type of vote
// const userCooldowns = new Map();

// exports.castVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has a cooldown for castVote
//     if (userCooldowns.has(userId) && userCooldowns.get(userId).castVote > Date.now()) {
//       // If the cooldown for castVote is active, return error
//       console.log(`User ${userId} attempted to cast vote before cooldown expiration for castVote.`);
//       return res.status(400).json({
//         error: "User has a cooldown",
//         message: "You can vote once every 24 hours.",
//       });
//     }

//     // Set the cooldown time for castVote to 24 hours from now
//     const castVoteCooldown = Date.now() + (24 * 60 * 60 * 1000);
//     const userCooldown = userCooldowns.get(userId) || {};
//     userCooldown.castVote = castVoteCooldown;
//     userCooldowns.set(userId, userCooldown);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId} in castVote.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// exports.castExtraVote = async (req, res, next) => {
//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;

//     // Check if the user has a cooldown for castExtraVote
//     if (userCooldowns.has(userId) && userCooldowns.get(userId).castExtraVote > Date.now()) {
//       // If the cooldown for castExtraVote is active, return error
//       console.log(`User ${userId} attempted to cast vote before cooldown expiration for castExtraVote.`);
//       return res.status(400).json({
//         error: "User has a cooldown",
//         message: "You can vote once every 3 days.",
//       });
//     }

//     // Set the cooldown time for castExtraVote to 3 days from now
//     const castExtraVoteCooldown = Date.now() + (3 * 24 * 60 * 60 * 1000);
//     const userCooldown = userCooldowns.get(userId) || {};
//     userCooldown.castExtraVote = castExtraVoteCooldown;
//     userCooldowns.set(userId, userCooldown);

//     // Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await knex("votes").insert(votesToInsert);

//     console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId} in castExtraVote.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     console.error(`Error in castExtraVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Periodically clean up expired cooldowns
// setInterval(() => {
//   const now = Date.now();
//   for (const [userId, cooldowns] of userCooldowns.entries()) {
//     if (cooldowns.castVote && cooldowns.castVote <= now) {
//       // If the castVote cooldown has expired, remove it
//       console.log(`Removing expired cooldown for castVote for user ${userId}.`);
//       delete cooldowns.castVote;
//     }
//     if (cooldowns.castExtraVote && cooldowns.castExtraVote <= now) {
//       // If the castExtraVote cooldown has expired, remove it
//       console.log(`Removing expired cooldown for castExtraVote for user ${userId}.`);
//       delete cooldowns.castExtraVote;
//     }
//     // If no more cooldowns exist for this user, remove the user from userCooldowns
//     if (Object.keys(cooldowns).length === 0) {
//       userCooldowns.delete(userId);
//     }
//   }
// }, 10 * 60 * 1000); // Run every 10 minutes to clean up expired cooldowns



// TESTING

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
        message: "You can vote once every 5 minutes.",
      });
    }

    // Set the cooldown time for castVote to 5 minutes from now
    const castVoteCooldown = Date.now() + (5 * 60 * 1000);
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
        message: "You can vote once every 10 minutes.",
      });
    }

    // Set the cooldown time for castExtraVote to 10 minutes from now
    const castExtraVoteCooldown = Date.now() + (10 * 60 * 1000);
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
}, 1 * 60 * 1000); // Run every 1 minute to clean up expired cooldowns
