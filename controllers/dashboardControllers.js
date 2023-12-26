const knex = require("knex")(require("../knexfile"));
const { validationResult } = require("express-validator");

exports.getUserDashboard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await knex.transaction();

  try {
    const firebaseUid = req.user.uid;

    // Fetch user data from the database
    const user = await knex("users")
      .transacting(transaction)
      .where({ firebase_auth_id: firebaseUid })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch contestant data from the database
    const contestantData = await knex("contestants")
      .transacting(transaction)
      .where({ user_id: user.id });

    if (!contestantData || contestantData.length === 0) {
      return res.status(404).json({ error: "Contestant data not found" });
    }

    await transaction.commit();

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      contestants: contestantData,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in getUserDashboard: ${error.message}`, {
      userId: req.user && req.user.uid,
    });

    next(error);
  }
};

