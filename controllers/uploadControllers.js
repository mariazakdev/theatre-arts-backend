const knex = require("knex")(require("../knexfile"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Router } = require("express");

// Configure the S3 client with your AWS credentials and set up earlier in your code
const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

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
        console.log("User:", user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if a contestant with the same user_id already exists
        const existingContestant = await knex("contestants")
            .where({ user_id: user.id })
            .first();
        console.log("Existing contestant:", existingContestant);
        if (existingContestant) {
            return res
                .status(409)
                .json({ error: "Contestant already exists for this user" });
        }

        // Insert contestant information into the database
        const [insertedId] = await knex("contestants").transacting(transaction).insert({
            user_id: user.id,
            name,
            url_photo: photoUrl,
            url_video: videoUrl,
            description,
            votes: 0,
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
        next(error);
    }
};

// Retrieve all contestants with their signed photo URLs
exports.getAllContestants = async (req, res, next) => {
    try {
        const contestants = await knex("contestants").select("*");
        console.log("Contestants:", contestants);

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
        next(error);
    }
};

exports.recordVote = async (req, res, next) => {
    const actorId = req.params.actorId;
    if (!actorId) {
        return res.status(400).json({ error: "No actorId provided" });
    }

    const { votes } = req.body;
    const votesToIncrement = parseInt(votes, 10); // Ensure 'votes' is an integer

    if (isNaN(votesToIncrement)) {
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
    res
      .status(200)
      .json({
        message: `Vote recorded successfully. This many votes: ${votesToIncrement}`,
      });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in recordVote controller: ${error.message}`, {
      stack: error.stack,
    });

    next(error);
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
exports.deleteContestant = async (req, res, next) => {
  const actorId = req.params.actorId;
const transaction = await knex.transaction();
  try {
    const rowsAffected = await knex("contestants")
    .transacting(transaction)
    .where({ id: actorId })
    .del();

    if (rowsAffected === 0) {
      return res.status(404).json({ error: "Contestant not found" });
    }
    await transaction.commit();
    res.status(200).json({ message: "Contestant deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in deleteContestant controller: ${error.message}`, {
      stack: error.stack,
    });
    next(error);
  }
};
