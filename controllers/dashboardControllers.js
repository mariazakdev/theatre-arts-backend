const knex = require('knex')(require('../knexfile'));

exports.getUserDashboard = async (req, res) => {
    try {
        // The user's Firebase UID is in req.user.uid
        const firebaseUid = req.user.uid;
        
        // Fetch user by firebase_auth_id
        const user = await knex('users').where({ firebase_auth_id: firebaseUid }).first();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is a contestant
        if (user.is_contestant) {
            // Fetch contestant data
            const contestantData = await knex('contestants').where({ user_id: user.id }).first();
            if (contestantData) {
                // Return both user and contestant data
                return res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name
                    },
                    contestant: contestantData
                });
            }
        }

        // If not a contestant or no contestant data found, return user data only
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error('Error fetching user dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};
