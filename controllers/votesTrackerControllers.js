const knex = require("knex")(require("../knexfile"));

// exports.createVoteTracker = async (req, res) => {
//   try {
//     const { userId, contestantId, numberOfVotes, round, email } = req.body;

//     // Validate input
//     if (!userId || !contestantId || !numberOfVotes || !round || !email) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Insert vote tracker data into the database
//     await knex('votes_tracker').insert({
//       user_id: userId,
//       contestant_id: contestantId,
//       votes_count: numberOfVotes,
//       voting_round: round,
//       email: email
//     });

//     res.status(201).json({ message: 'Vote tracker created successfully' });
//   } catch (error) {
//     console.error('Error creating vote tracker:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.createVoteTracker = async (req, res) => {
  try {
    const { userId, contestantId, numberOfVotes, round, email } = req.body;

    // Validate input
    if (!userId || !contestantId || !numberOfVotes || !round || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a vote tracker already exists for the user and contestant
    const existingVoteTracker = await knex('votes_tracker')
      .where({ user_id: userId, contestant_id: contestantId })
      .first();

    if (existingVoteTracker) {
      // Update the existing vote tracker instead of creating a new one
      await knex('votes_tracker')
        .where({ user_id: userId, contestant_id: contestantId })
        .update({
          votes_count: knex.raw('votes_count + ?', [numberOfVotes]), // Increment votes count
          voting_round: round, // Update round if needed
          email: email // Update email if needed
        });

      return res.status(200).json({ message: 'Vote tracker updated successfully' });
    }

    // Insert vote tracker data into the database
    await knex('votes_tracker').insert({
      user_id: userId,
      contestant_id: contestantId,
      votes_count: numberOfVotes,
      voting_round: round,
      email: email
    });

    res.status(201).json({ message: 'Vote tracker created successfully' });
  } catch (error) {
    console.error('Error creating/updating vote tracker:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getVoteTrackers = async (req, res) => {
  try {
    // Retrieve all vote trackers from the database
    const voteTrackers = await knex('votes_tracker').select('*');
    res.status(200).json(voteTrackers);
  } catch (error) {
    console.error('Error retrieving vote trackers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getVotesForContestant = async (req, res) => {
  try {
    const { contestantId } = req.params;

    // Retrieve all vote trackers for a specific contestant
    const voteTrackers = await knex('votes_tracker')
      .where({ contestant_id: contestantId })
      .select('*');

    res.status(200).json(voteTrackers);
  } catch (error) {
    console.error('Error retrieving vote trackers for contestant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};