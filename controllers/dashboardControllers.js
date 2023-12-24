const knex = require('knex')(require('../knexfile'));


exports.getUserDashboard = async (req, res, next) => {
    try {
        const firebaseUid = req.user.uid; // User's Firebase UID
        const user = await knex('users').where({ firebase_auth_id: firebaseUid }).first();
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch all contestant data for the user
        const contestantData = await knex('contestants').where({ user_id: user.id });
        if (!contestantData || contestantData.length === 0) {
            return res.status(404).json({ error: 'Contestant data not found' });
        }
        res.json({
            user: {
                id: user.id,
                email: user.email
            },
            contestants: contestantData 
        });

    } catch (error) {
      next(error);
    }
};
