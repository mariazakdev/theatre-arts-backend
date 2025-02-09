const knex = require("knex")(require("../knexfile"));

// ✅ Function to check if the user is eligible to vote
const checkVoteEligibility = async (userId) => {
    console.log(`[checkVoteEligibility] Checking eligibility for userId: ${userId}`);

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    console.log(`[checkVoteEligibility] Three days ago timestamp: ${threeDaysAgo}`);

    try {
        const lastVote = await knex("votes_extra")
            .where("user_id", userId)
            .orderBy("last_voted_at", "desc")
            .first();

        console.log(`[checkVoteEligibility] Last vote record:`, lastVote);

        if (lastVote && new Date(lastVote.last_voted_at) > threeDaysAgo) {
            return { eligible: false, message: `You must wait 3 days before voting again.` };
        }

        return { eligible: true };

    } catch (error) {
        console.error("[checkVoteEligibility] Error checking vote eligibility:", error);
        return { eligible: false, message: "Error checking eligibility." };
    }
};


// ✅ Route: Check if the user is eligible to vote before payment
exports.checkVoteEligibility = async (req, res) => {
    const { userId } = req.body;
    // console.log(`[checkVoteEligibility Route] Received request with userId: ${userId}`);

    if (!userId) {
        // console.log("[checkVoteEligibility Route] Missing userId in request.");
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const eligibility = await checkVoteEligibility(userId);
        // console.log(`[checkVoteEligibility Route] Eligibility response:`, eligibility);

        if (!eligibility.eligible) {
            return res.status(400).json({ message: eligibility.message });
        }

        res.status(200).json({ message: "Eligible to vote." });
    } catch (error) {
        console.error("[checkVoteEligibility Route] Error:", error);
        res.status(500).json({ message: "Server error checking vote eligibility." });
    }
};

// ✅ Route: Record the vote only after payment is confirmed (No Extra Eligibility Check)
exports.castVote = async (req, res) => {
    const { userId, contestantId, numberOfVotes } = req.body;
    console.log(`[castVote] Received request with data:`, { userId, contestantId, numberOfVotes });

    if (!userId || !contestantId || !numberOfVotes) {
        console.log("[castVote] Missing vote data in request.");
        return res.status(400).json({ message: "Missing vote data." });
    }

    try {
        // ✅ Retrieve user data
        const user = await knex("users").where("id", userId).first();
        console.log(`[castVote] Retrieved user data:`, user);

        if (!user) {
            console.log(`[castVote] User with id ${userId} not found in the database.`);
            return res.status(404).json({ message: "User not found in the database." });
        }

        // ✅ Insert vote into votes_extra (last_voted_at updates only if 5 min passed)
        const voteInsert = {
            user_id: userId,
            contestant_id: contestantId,
            number_of_votes: numberOfVotes,
            created_at: knex.fn.now(),
            last_voted_at: knex.fn.now(), // ✅ No need to check eligibility again
        };
        console.log(`[castVote] Inserting vote into votes_extra:`, voteInsert);
        await knex("votes_extra").insert(voteInsert);

        // ✅ Check if user has already voted for this contestant in votes_tracker
        const existingVote = await knex("votes_tracker")
            .where("user_id", userId)
            .andWhere("contestant_id", contestantId)
            .first();

        if (existingVote) {
            // ✅ Update existing record by adding votes
            console.log(`[castVote] Updating existing vote record for contestant ${contestantId}.`);
            await knex("votes_tracker")
                .where("user_id", userId)
                .andWhere("contestant_id", contestantId)
                .update({
                    votes_count: existingVote.votes_count + parseInt(numberOfVotes, 10),
                    voting_round: 1,
                    created_at: knex.fn.now(),
                });
        } else {
            // ✅ Insert new entry if no existing vote
            const trackerInsert = {
                user_id: userId,
                contestant_id: contestantId,
                email: user.email,
                votes_count: numberOfVotes,
                voting_round: 1,
                created_at: knex.fn.now(),
            };
            console.log(`[castVote] Inserting new vote into votes_tracker:`, trackerInsert);
            await knex("votes_tracker").insert(trackerInsert);
        }

        console.log(`[castVote] Vote recorded successfully for user ${userId}.`);
        res.status(200).json({ message: "Vote recorded successfully." });

    } catch (error) {
        console.error("[castVote] Error adding vote:", error);
        res.status(500).json({ message: "Server error adding vote." });
    }
};
