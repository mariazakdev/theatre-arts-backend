
const knex = require("knex")(require("../knexfile"));

const userExpirations = new Map();

exports.checkVoteEligibility = async (req, res) => {
  const { userId, contestantId } = req.body;

  try {
    if (!userId || !contestantId) {
      return res.status(400).json({ error: "Missing userId or contestantId" });
    }

    // Check for an existing vote expiration in the database
    const existingVote = await knex("votes_extra")
      .where({ user_id: userId, contestant_id: contestantId })
      .select("created_at")
      .first();

    if (existingVote) {
      const voteTime = new Date(existingVote.created_at).getTime();
      const expirationTime = voteTime + (5 * 60 * 1000); // 5 minutes from vote time
      if (expirationTime > Date.now()) {
        const remainingTime = Math.ceil((expirationTime - Date.now()) / 1000);
        return res.status(400).json({
          error: "User is currently ineligible",
          message: `You must wait ${remainingTime} seconds before voting again.`,
          remainingTime, // Include for frontend use
        });
      }
    }

    res.status(200).json({ message: "User is eligible to vote" });
  } catch (error) {
    console.error(`Error in checkVoteEligibility: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};




exports.castExtraVote = async (req, res, next) => {
  const trx = await knex.transaction();

  try {
    const { userId, contestantId, numberOfVotes } = req.body;

    // Step 1: Check if the user has already voted for the contestant
    const existingVote = await trx("votes_extra")
      .where({ user_id: userId, contestant_id: contestantId })
      .first();

    if (existingVote && userExpirations.has(userId)) {
      const expirationTime = userExpirations.get(userId);
      if (expirationTime > Date.now()) {
        // If the vote is not expired, return error
        console.log(`User ${userId} attempted to vote again before expiration.`);
        await trx.rollback();
        return res.status(400).json({
          error: "User has already voted",
          message: "User can only vote extra once every 3 days.",
        });
      } else {
        // Step 2: If the vote is expired, delete the old vote
        await trx("votes_extra")
          .where({ user_id: userId, contestant_id: contestantId })
          .del();
        userExpirations.delete(userId);
      }
    }

    // const expirationTime = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
    const expirationTime = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds

    userExpirations.set(userId, expirationTime);

    // Step 4: Insert a new vote record for each vote
    const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
      user_id: userId,
      contestant_id: contestantId,
    }));

    await trx("votes_extra").insert(votesToInsert);
    await trx.commit();

    console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
    res.status(201).json({ message: "Votes cast successfully" });
  } catch (error) {
    await trx.rollback();
    console.error(`Error in castExtraVote controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error." });
  }
};

// Periodically clean up expired votes
setInterval(async () => {
  const now = Date.now();
  console.log("Running cleanup interval", { now });

  for (const [userId, expirationTime] of userExpirations.entries()) {
    if (expirationTime <= now) {
      console.log(`Removing expired vote for user ${userId}.`);
      userExpirations.delete(userId);

      try {
        const rowsDeleted = await knex("votes_extra")
          .where({ user_id: userId })
          .del();
        console.log(`Expired vote for user ${userId} deleted from the database. Rows deleted: ${rowsDeleted}`);
      } catch (error) {
        console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
      }
    }
  }
// }, 3 * 24 * 60 * 60 * 1000); // Run every 3 days to clean up expired votes
}, 60 * 1000); // Runs every 1 minute





// exports.castExtraVote = async (req, res, next) => {
// //  const trx = await knex.transaction();

// //  try {
// //  const { userId, contestantId, numberOfVotes } = req.body;

// //  // Step 1: Check if the user has already voted for the contestant (optional - can be removed if no need for uniqueness)
// // const existingVote = await trx("votes_extra")
// //  .where({ user_id: userId, contestant_id: contestantId })
// //  .first();

// //  // If an existing vote is found, delete it to avoid duplicates (optional, depends on the requirement)
// //  if (existingVote) {
// // await trx("votes_extra")
// //  .where({ user_id: userId, contestant_id: contestantId })
// // .del();
// //  }

// //  // Step 2: Insert a new vote record for each vote
// //  const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
// // user_id: userId,
// // contestant_id: contestantId,
// //  }));

// //  await trx("votes_extra").insert(votesToInsert);
// //  await trx.commit();

// //  console.log(`User ${userId} cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
// //  res.status(201).json({ message: "Votes cast successfully" });
// //  } catch (error) {
// //  await trx.rollback();
// // console.error(`Error in castExtraVote controller: ${error.message}`, {
// //  stack: error.stack,
// //  });
// //  res.status(500).json({ message: "Internal server error." });
// //  }
// // };

// const knex = require("knex")(require("../knexfile"));

// const userExpirations = new Map();

// exports.checkVoteEligibility = async (req, res) => {
//   const { userId, contestantId } = req.body;

//   try {
//     console.log(`Checking vote eligibility for user ${userId} and contestant ${contestantId}`);

//     if (!userId || !contestantId) {
//       console.log("Missing userId or contestantId");
//       return res.status(400).json({ error: "Missing userId or contestantId" });
//     }

//     // Check for an existing vote expiration in the database
//     const existingVote = await knex("votes_extra")
//       .where({ user_id: userId, contestant_id: contestantId })
//       .select("created_at")
//       .first();

//     if (existingVote) {
//       // Convert DB timestamp to UTC
//       const voteTimeUTC = new Date(existingVote.created_at).getTime();
//       const expirationTime = voteTimeUTC + (5 * 60 * 1000); // 5 minutes later
//       const currentTimeUTC = Date.now(); // Always use UTC timestamp

//       console.log(`Vote time (DB, UTC): ${new Date(voteTimeUTC).toISOString()}`);
//       console.log(`Current time (UTC): ${new Date(currentTimeUTC).toISOString()}`);
//       console.log(`Expected expiration time (UTC): ${new Date(expirationTime).toISOString()}`);

//       if (expirationTime > currentTimeUTC) {
//         const remainingTime = Math.ceil((expirationTime - currentTimeUTC) / 1000);
//         console.log(`User ${userId} must wait ${remainingTime} seconds before voting again.`);
//         return res.status(400).json({
//           error: "User is currently ineligible",
//           message: `You must wait ${remainingTime} seconds before voting again.`,
//           remainingTime,
//         });
//       } else {
//         console.log(`Vote for user ${userId} has expired. Removing from database.`);
//         await knex("votes_extra")
//           .where({ user_id: userId, contestant_id: contestantId })
//           .del();
//       }
//     }

//     console.log(`User ${userId} is eligible to vote.`);
//     res.status(200).json({ message: "User is eligible to vote" });
//   } catch (error) {
//     console.error(`Error in checkVoteEligibility: ${error.message}`);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };



// exports.castExtraVote = async (req, res, next) => {
//   const trx = await knex.transaction();

//   try {
//     const { userId, contestantId, numberOfVotes } = req.body;
//     console.log(`User ${userId} attempting to cast ${numberOfVotes} votes for contestant ${contestantId}`);

//     // Step 1: Check if the user has already voted for the contestant
//     const existingVote = await trx("votes_extra")
//       .where({ user_id: userId, contestant_id: contestantId })
//       .first();

//     if (existingVote && userExpirations.has(userId)) {
//       const expirationTime = userExpirations.get(userId);
//       console.log(`Existing vote found for user ${userId}. Expiration time: ${new Date(expirationTime).toISOString()}`);

//       if (expirationTime > Date.now()) {
//         console.log(`User ${userId} attempted to vote again before expiration.`);
//         await trx.rollback();
//         return res.status(400).json({
//           error: "User has already voted",
//           message: "User can only vote extra once every 3 days.",
//         });
//       } else {
//         console.log(`User ${userId}'s vote expired. Deleting old vote.`);
//         await trx("votes_extra")
//           .where({ user_id: userId, contestant_id: contestantId })
//           .del();
//         userExpirations.delete(userId);
//       }
//     }

//     const expirationTime = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds
//     console.log(`Setting new expiration for user ${userId}: ${new Date(expirationTime).toISOString()}`);

//     userExpirations.set(userId, expirationTime);

//     // Step 4: Insert a new vote record for each vote
//     const votesToInsert = Array.from({ length: numberOfVotes }, () => ({
//       user_id: userId,
//       contestant_id: contestantId,
//     }));

//     await trx("votes_extra").insert(votesToInsert);
//     await trx.commit();

//     console.log(`User ${userId} successfully cast ${numberOfVotes} vote(s) for contestant ${contestantId}.`);
//     res.status(201).json({ message: "Votes cast successfully" });
//   } catch (error) {
//     await trx.rollback();
//     console.error(`Error in castExtraVote controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Periodically clean up expired votes
// setInterval(async () => {
//   const nowUTC = Date.now();
//   console.log("Running cleanup interval", { now: new Date(nowUTC).toISOString() });

//   for (const [userId, expirationTime] of userExpirations.entries()) {
//     console.log(`Checking user ${userId}: Expiration time ${new Date(expirationTime).toISOString()}`);

//     if (expirationTime <= nowUTC) {
//       console.log(`Removing expired vote for user ${userId}.`);
//       userExpirations.delete(userId);

//       try {
//         // Ensure votes older than 5 minutes are deleted
//         const deletedVotes = await knex("votes_extra")
//           .where("user_id", userId)
//           .where("created_at", "<=", new Date(nowUTC - (5 * 60 * 1000)).toISOString()) // Ensure proper timestamp comparison
//           .del();

//         console.log(`Expired votes for user ${userId} deleted from the database. Rows deleted: ${deletedVotes}`);
//       } catch (error) {
//         console.error(`Error deleting expired vote for user ${userId}: ${error.message}`);
//       }
//     }
//   }
// }, 60 * 1000); // Runs every 1 minute
