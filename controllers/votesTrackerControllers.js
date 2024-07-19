const knex = require("knex")(require("../knexfile"));

const createVoteTracker = async (req, res) => {
  try {
    const { userId, contestantId, numberOfVotes, round, email } = req.body;

    // Validate input
    if (!userId || !contestantId || !numberOfVotes || !round || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing vote tracker entry
    const existingVote = await knex('votes_tracker')
      .where({
        user_id: userId,
        contestant_id: contestantId,
        voting_round: round
      })
      .first();

    if (existingVote) {
      // Update the existing vote count only
      await knex('votes_tracker')
        .where({ id: existingVote.id })
        .update({
          votes_count: existingVote.votes_count + numberOfVotes
        });

      return res.status(200).json({ message: 'Vote tracker updated successfully' });
    } else {
      // Insert new vote tracker data into the database
      await knex('votes_tracker').insert({
        user_id: userId,
        contestant_id: contestantId,
        votes_count: numberOfVotes,
        voting_round: round,
        email: email
      });

      return res.status(201).json({ message: 'Vote tracker created successfully' });
    }
  } catch (error) {
    console.error('Error creating vote tracker:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createVoteTracker = createVoteTracker;

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
