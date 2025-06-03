const knex = require("knex")(require("../knexfile"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Router } = require("express");
const logger = require("../logger");
const { group } = require("console");
const { on } = require("events");

// Configure the S3 client with your AWS credentials and set up earlier in your code
const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;


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

exports.getContestantThankYouInfo = async (req, res, next) => {
  const { actorId } = req.params;

  try {
    const contestant = await knex("contestants")
      .where("contestants.id", actorId)
      .join("users", "contestants.user_id", "users.id")
      .select("contestants.name", "users.email as actor_email")
      .first();

    if (!contestant) {
      return res.status(404).json({ error: "Contestant not found" });
    }

    res.status(200).json({
      actorName: contestant.name,
      actorEmail: contestant.actor_email,
    });
  } catch (error) {
    console.error("Error in getContestantThankYouInfo:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    // Delete related entries in the votes_tracker table
    await knex("votes_tracker")
      .transacting(transaction)
      .where({ contestant_id: contestantId })
      .del();

    console.log(`Deleted related entries in votes_tracker for contestant ID: ${contestantId}`); // Add logging

    // Delete related entries in the votes table
    await knex("votes")
      .transacting(transaction)
      .where({ contestant_id: contestantId })
      .del();

    console.log(`Deleted related entries in votes for contestant ID: ${contestantId}`); // Add logging

    // Delete related entries in the votes_extra table by contestant_id
    await knex("votes_extra")
      .transacting(transaction)
      .where({ contestant_id: contestantId })
      .del();

    console.log(`Deleted related entries in votes_extra for contestant ID: ${contestantId}`); // Add logging

    // Delete the contestant
    await knex("contestants")
      .transacting(transaction)
      .where({ id: contestantId })
      .del();

    console.log(`Deleted contestant with ID: ${contestantId}`); // Add logging

    // Delete related entries in the votes_extra table by user_id
    await knex("votes_extra")
      .transacting(transaction)
      .where({ user_id: userId })
      .del();

    console.log(`Deleted related entries in votes_extra for user ID: ${userId}`); // Add logging

    // Delete related entries in the votes table that reference the user_id
    await knex("votes")
      .transacting(transaction)
      .where({ user_id: userId })
      .del();

    console.log(`Deleted related entries in votes for user ID: ${userId}`); // Add logging

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

//////// Admin Tech small updates /////////////////////

// Update photo URL of a contestant
exports.updatePhoto = async (req, res, next) => {
  const { actorId } = req.params;
  const { photoUrl } = req.body;

  if (!photoUrl) {
    return res.status(400).json({ error: "Photo URL is required" });
  }

  try {
    await knex("contestants")
      .where({ id: actorId })
      .update({ url_photo: photoUrl });

    res.status(200).json({ message: "Photo updated successfully" });
  } catch (error) {
    console.error("Error updating photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update video URL of a contestant
exports.updateVideo = async (req, res, next) => {
  const { actorId } = req.params;
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    await knex("contestants")
      .where({ id: actorId })
      .update({ url_video: videoUrl });

    res.status(200).json({ message: "Video updated successfully" });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update description of a contestant
exports.updateDescription = async (req, res, next) => {
  const { actorId } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    await knex("contestants")
      .where({ id: actorId })
      .update({ description: description });

    res.status(200).json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update name of a contestant
exports.updateName = async (req, res, next) => {
  const { actorId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    await knex("contestants")
      .where({ id: actorId })
      .update({ name });

    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Controller for updating round number of a specific contestant
exports.updateRoundNumberManually = async (req, res, next) => {
  const { roundNumber } = req.body;
  const { actorId } = req.params;

  if (!roundNumber || isNaN(roundNumber)) {
    return res.status(400).json({ error: "Invalid round number" });
  }

  try {
    await knex('contestants')
      .where({ id: actorId, active: 1 })
      .update({ round: roundNumber });

    res.status(200).json({ message: `Round number updated to ${roundNumber} successfully` });
  } catch (error) {
    console.error(`Error in updateRoundNumberManually controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for updating group number of a specific contestant
exports.updateGroupNumberManually = async (req, res, next) => {
  const { groupNumber } = req.body;
  const { actorId } = req.params;

  if (!groupNumber || isNaN(groupNumber)) {
    return res.status(400).json({ error: "Invalid group number" });
  }

  try {
    await knex('contestants')
      .where({ id: actorId, active: 1 })
      .update({ group_number: groupNumber });

    res.status(200).json({ message: `Group number updated to ${groupNumber} successfully` });
  } catch (error) {
    console.error(`Error in updateGroupNumberManually controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//  increment the round, deactivate contestants, and regroup remaining contestants
exports.incrementRoundAndRegroup = async (req, res, next) => {
  const transaction = await knex.transaction();

  try {
    // Increment the round for all active contestants
    await knex('contestants')
      .transacting(transaction)
      .where({ active: 1 })
      .increment('round', 1);

    // Fetch all active contestants, sorted by their group number and votes
    const activeContestants = await knex('contestants')
      .where({ active: 1 })
      .orderBy('group_number')
      .orderBy('votes', 'desc');

    // Group contestants by group_number
    const groupsMap = {};
    activeContestants.forEach(contestant => {
      if (!groupsMap[contestant.group_number]) {
        groupsMap[contestant.group_number] = [];
      }
      groupsMap[contestant.group_number].push(contestant);
    });

    // Determine the top 3 in each group and mark the rest inactive
    const updatedContestants = [];
    Object.values(groupsMap).forEach(group => {
      group.forEach((contestant, index) => {
        if (index < 3) {
          // Top 3 contestants remain active
          updatedContestants.push(contestant);
        } else {
          // Others become inactive
          contestant.active = 0;
          updatedContestants.push(contestant);
        }
      });
    });

    // Regroup the remaining active contestants
    let groupNumber = 1;
    let groupCounter = 0;
    for (const contestant of updatedContestants) {
      if (contestant.active === 1) {
        if (groupCounter >= 10) {
          groupNumber++;
          groupCounter = 0;
        }
        contestant.group_number = groupNumber;
        groupCounter++;
      }

      await knex('contestants')
        .transacting(transaction)
        .where({ id: contestant.id })
        .update({
          group_number: contestant.group_number,
          active: contestant.active,
        });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Round updated and groups reset successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in incrementRoundAndRegroup controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//////// IT Tech Routes ////////////

// Deactivate all contestants except the top 3 in each group
// STEP 1 towards the end 
exports.deactivateNonTopThree = async (req, res, next) => {
  const transaction = await knex.transaction();

  try {
    // Fetch all active contestants, sorted by their group number and votes
    const activeContestants = await knex('contestants')
      .transacting(transaction)
      .where({ active: 1 })
      .orderBy('group_number')
      .orderBy('votes', 'desc');

    // Group contestants by group_number
    const groupsMap = {};
    activeContestants.forEach(contestant => {
      if (!groupsMap[contestant.group_number]) {
        groupsMap[contestant.group_number] = [];
      }
      groupsMap[contestant.group_number].push(contestant);
    });

    // Determine the top 3 in each group and mark the rest inactive
    const updatedContestants = [];
    Object.values(groupsMap).forEach(group => {
      group.forEach((contestant, index) => {
        if (index >= 3) {
          // Deactivate contestants not in the top 3
          contestant.active = 0;
          updatedContestants.push(contestant);
        }
      });
    });

    for (const contestant of updatedContestants) {
      await knex('contestants')
        .transacting(transaction)
        .where({ id: contestant.id })
        .update({
          active: contestant.active,
        });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Non-top-3 contestants deactivated successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in deactivateNonTopThree controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Remove all votes. Start at zero
// STEP 2 towards the end
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

// Regroup new set of active contestants
// STEP 3 towards the end
exports.regroupActiveContestants = async (req, res, next) => {
  const transaction = await knex.transaction();

  try {
    // Fetch all active contestants
    const activeContestants = await knex('contestants')
      .transacting(transaction)
      .where({ active: 1 })
      .orderBy('votes', 'desc');

    // Regroup the contestants
    let groupNumber = 1;
    let groupCounter = 0;
    for (const contestant of activeContestants) {
      if (groupCounter >= 10) {
        groupNumber++;
        groupCounter = 0;
      }
      contestant.group_number = groupNumber;
      groupCounter++;

      await knex('contestants')
        .transacting(transaction)
        .where({ id: contestant.id })
        .update({
          group_number: contestant.group_number,
        });
    }

    await transaction.commit();
    res.status(200).json({ message: 'Contestants regrouped successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in regroupActiveContestants controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// New round
// STEP 4 towards the end
// Increment the round for all active contestants and update groups
exports.updateRoundForActiveContestants = async (req, res, next) => {
  const transaction = await knex.transaction();

  try {
    // Increment the round for all active contestants
    await knex('contestants')
      .transacting(transaction)
      .where({ active: 1 })
      .increment('round', 1);

    await transaction.commit();
    res.status(200).json({ message: 'Round updated for all active contestants successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in updateRoundForActiveContestants controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update votes for testing only
exports.updateVotesForContestant = async (req, res, next) => {
  const { contestantId } = req.params;
  const { votes } = req.body;

  if (!votes || isNaN(votes)) {
    return res.status(400).json({ error: "Invalid number of votes" });
  }

  const transaction = await knex.transaction();

  try {
    // Update the votes for the specific contestant
    await knex('contestants')
      .transacting(transaction)
      .where({ id: contestantId })
      .update({ votes });

    await transaction.commit();
    res.status(200).json({ message: `Votes updated to ${votes} for contestant ID ${contestantId} successfully` });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in updateVotesForContestant controller: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

