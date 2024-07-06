const knex = require("knex")(require("../knexfile"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Router } = require("express");
const logger = require("../logger");

// Configure the S3 client with your AWS credentials and set up earlier in your code
const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// From upload form
// exports.newContestant = async (req, res, next) => {
//   const transaction = await knex.transaction();

//   try {
//     const { firebaseId, photoUrl, videoUrl, description, name } = req.body;

//     // Input Validation
//     if (!firebaseId || !photoUrl || !videoUrl || !description || !name) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Retrieve the user from the database
//     const [user] = await knex("users").where({ firebase_auth_id: firebaseId });
//     console.log("User:", user);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if a contestant with the same user_id already exists
//     const existingContestant = await knex("contestants")
//       .where({ user_id: user.id })
//       .first();
//     console.log("A contestant was added. Good luck");
//     if (existingContestant) {
//       return res
//         .status(409)
//         .json({ error: "Contestant already exists for this user" });
//     }

//     // Insert contestant information into the database
//     const [insertedId] = await knex("contestants")
//       .transacting(transaction)
//       .insert({
//         user_id: user.id,
//         name,
//         url_photo: photoUrl,
//         url_video: videoUrl,
//         description,
//         votes: 0,
//       });
//     await transaction.commit();

//     res.status(201).json({
//       contestantId: insertedId,
//       message: "Contestant created successfully",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     logger.error(`Error in newContestant controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

//New contestant in groups
exports.newContestant = async (req, res, next) => {
  const transaction = await knex.transaction();

  try {
    const { firebaseId, photoUrl, videoUrl, description, name } = req.body;

    // Input Validation
    if (!firebaseId || !photoUrl || !videoUrl || !description || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Retrieve the user from the database
    const [user] = await knex("users").where({ firebase_auth_id: firebaseId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if a contestant with the same user_id already exists
    const existingContestant = await knex("contestants")
      .where({ user_id: user.id })
      .first();
    if (existingContestant) {
      return res
        .status(409)
        .json({ error: "Contestant already exists for this user" });
    }

    // Determine the group number for the new contestant
    const [lastGroup] = await knex("contestants")
      .select("group_number")
      .orderBy("group_number", "desc")
      .limit(1);

    let groupNumber = 1; // Default group number
    if (lastGroup && lastGroup.group_number) {
      const [currentGroupCount] = await knex("contestants")
        .count("id as count")
        .where({ group_number: lastGroup.group_number });

      if (currentGroupCount.count >= 10) {
        groupNumber = lastGroup.group_number + 1;
      } else {
        groupNumber = lastGroup.group_number;
      }
    }

    // Insert contestant information into the database
    const [insertedId] = await knex("contestants")
      .transacting(transaction)
      .insert({
        user_id: user.id,
        name,
        url_photo: photoUrl,
        url_video: videoUrl,
        description,
        votes: 0,
        group_number: groupNumber,
      });
    await transaction.commit();

    res.status(201).json({
      contestantId: insertedId,
      message: "Contestant created successfully",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in newContestant controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Retrieve all contestants with their signed photo URLs
exports.getAllContestants = async (req, res, next) => {
  try {
    const contestants = await knex("contestants").select("*");

    for (const contestant of contestants) {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: contestant.url_photo,
      });
      contestant.signedPhotoUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 900,
      });
    }

    res.json(contestants);
  } catch (error) {
    logger.error(`Error in getAllContestants controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// From dashboard
exports.updateContestant = async (req, res, next) => {
  const actorId = req.params.actorId;
  const { videoUrl, description } = req.body;

  try {
    // Input Validation
    if (!actorId || (!videoUrl && !description)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if the contestant exists
    const contestant = await knex("contestants").where({ id: actorId }).first();
    if (!contestant) {
      return res.status(404).json({ error: "Contestant not found" });
    }

    // Update contestant data
    const updatedContestant = {};
    if (videoUrl) updatedContestant.url_video = videoUrl;
    if (description) updatedContestant.description = description;

    await knex("contestants").where({ id: actorId }).update(updatedContestant);

    res.status(200).json({ message: "Contestant data updated successfully" });
  } catch (error) {
    logger.error(`Error in updateContestant controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Vote buttons
exports.recordVote = async (req, res, next) => {
  const actorId = req.params.actorId;
  if (!actorId) {
    return res.status(400).json({ error: "No actorId provided" });
  }

  const { votes } = req.body;
  const votesToIncrement = parseInt(votes, 10);

  if (isNaN(votesToIncrement) || votesToIncrement < 0) {
    return res.status(400).json({ error: "Invalid number of votes" });
  }

  const transaction = await knex.transaction();
  try {
    const rowsAffected = await knex("contestants")
      .transacting(transaction)
      .where({ id: actorId })
      .increment("votes", votesToIncrement);

    if (rowsAffected === 0) {
      return res.status(404).json({ error: "Contestant not found" });
    }
    await transaction.commit();
    res.status(200).json({
      message: `Vote recorded successfully. This many votes: ${votesToIncrement}`,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in recordVote controller: ${error.message}`, {
      stack: error.stack,
    });

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reset votes after rounds
exports.resetVotes = async (req, res, next) => {
  const { actorId } = req.params;

  try {
    // Reset votes for all active contestants if no actorId is provided
    if (!actorId) {
      await knex("contestants").where({ active: 1 }).update({ votes: 0 });
    } else {
      // Reset votes for the specific contestant with the provided actorId
      await knex("contestants").where({ id: actorId }).update({ votes: 0 });
    }

    res.status(200).json({ message: "Votes reset successfully" });
  } catch (error) {
    console.error(`Error in resetVotes controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Reset rounds 
exports.updateRound = async (req, res, next) => {
  try {
    // Increment the round for all active contestants
    await knex('contestants')
      .where({ active: 1 })
      .increment('round', 1);

    res.status(200).json({ message: 'Round updated successfully for all active contestants' });
  } catch (error) {
    console.error(`Error in updateRound controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getContestantById = async (req, res, next) => {
  try {
    const actorId = req.params.actorId;

    const contestant = await knex("contestants").where({ id: actorId }).first();

    if (!contestant) {
      return res.status(404).json({ error: "Contestant not found" });
    }

    res.json(contestant);
  } catch (error) {
    logger.error(`Error in getContestantById controller: ${error.message}`, {
      stack: error.stack,
    });
    next(error);
  }
};

exports.updateContestantActiveStatus = async (req, res, next) => {
  const actorId = req.params.actorId;
  const { active } = req.body;

  try {
    // Input Validation
    if (!actorId || active === undefined || (active !== 0 && active !== 1)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if the contestant exists
    const contestant = await knex("contestants").where({ id: actorId }).first();
    if (!contestant) {
      return res.status(404).json({ error: "Contestant not found" });
    }

    // Update active status
    await knex("contestants").where({ id: actorId }).update({ active });

    res
      .status(200)
      .json({ message: "Contestant active status updated successfully" });
  } catch (error) {
    logger.error(
      `Error in updateContestantActiveStatus controller: ${error.message}`,
      {
        stack: error.stack,
      }
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.deleteContestant = async (req, res, next) => {
//   const actorId = req.params.actorId;
//   const transaction = await knex.transaction();
//   try {
//     const rowsAffected = await knex("contestants")
//       .transacting(transaction)
//       .where({ id: actorId })
//       .del();

//     if (rowsAffected === 0) {
//       return res.status(404).json({ error: "Contestant not found" });
//     }
//     await transaction.commit();
//     res.status(200).json({ message: "Contestant deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     logger.error(`Error in deleteContestant controller: ${error.message}`, {
//       stack: error.stack,
//     });
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.deleteContestant = async (req, res, next) => {
  const { contestantId } = req.params;

  console.log(`Received request to delete contestant with ID: ${contestantId}`); // Add logging

  if (!contestantId) {
    console.log("Contestant ID is missing"); // Add logging
    return res.status(400).json({ error: "Contestant ID is required" });
  }

  const transaction = await knex.transaction();
  try {
    // Find the user_id related to the contestant
    const [contestant] = await knex("contestants")
      .transacting(transaction)
      .where({ id: contestantId })
      .select("user_id");

    if (!contestant) {
      await transaction.rollback();
      console.log(`Contestant with ID ${contestantId} not found`); // Add logging
      return res.status(404).json({ error: "Contestant not found" });
    }

    const userId = contestant.user_id;

    console.log(`Deleting related entries for contestant ID: ${contestantId}`); // Add logging

    // First, delete related entries in the votes_tracker table
    await knex("votes_tracker")
      .transacting(transaction)
      .where({ contestant_id: contestantId })
      .del();

    console.log(`Deleted related entries for contestant ID: ${contestantId}`); // Add logging

    // Then, delete the contestant
    await knex("contestants")
      .transacting(transaction)
      .where({ id: contestantId })
      .del();

    console.log(`Deleted contestant with ID: ${contestantId}`); // Add logging

    // Finally, delete the user
    await knex("users")
      .transacting(transaction)
      .where({ id: userId })
      .del();

    await transaction.commit();

    console.log(`Deleted user with ID: ${userId}`); // Add logging
    res.status(200).json({ message: "Contestant and user deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting contestant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.activateAllContestants = async (req, res, next) => {
  try {
    // Update active status for all contestants to 1
    await knex("contestants").update({ active: 1 });

    // Send response
    res.status(200).json({ message: "All contestants activated successfully" });
  } catch (error) {
    logger.error(
      `Error in activateAllContestants controller: ${error.message}`,
      {
        stack: error.stack,
      }
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submitVideo = async (req, res, next) => {
  const actorId = req.params.actorId;
  const { videoUrl } = req.body;

  try {
    // Your logic to handle video submission (e.g., update contestant's video URL)
    // Example:
    await knex("contestants").where({ id: actorId }).update({ url_video: videoUrl });

    res.status(200).json({ message: "Video submitted successfully" });
  } catch (error) {
    console.error("Error submitting video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateGroups = async (req, res, next) => {
  const { groupedContestants } = req.body;

  if (!groupedContestants || !Array.isArray(groupedContestants)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const transaction = await knex.transaction();

  try {
    for (const group of groupedContestants) {
      const { groupId, contestantIds } = group;
      if (!groupId || !Array.isArray(contestantIds)) {
        return res.status(400).json({ error: "Invalid group data" });
      }

      // Update group number for each contestant in the group
      for (const id of contestantIds) {
        await knex('contestants')
          .transacting(transaction)
          .where({ id })
          .update({ group: groupId });
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Groups updated successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in updateGroups controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
