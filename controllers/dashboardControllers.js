const knex = require('knex')(require('../knexfile'));

// exports.getUserDashboard = async (req, res) => {
//     try {
//         const firebaseUid = req.user.uid; // User's Firebase UID
//         const user = await knex('users').where({ firebase_auth_id: firebaseUid }).first();
        
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Fetch all contestant data for the user
//         const contestantData = await knex('contestants').where({ user_id: user.id });
        
//         res.json({
//             user: {
//                 id: user.id,
//                 email: user.email
//             },
//             contestants: contestantData
//         });

//     } catch (error) {
//         console.error('Error fetching user dashboard data:', error);
//         res.status(500).json({ error: 'Failed to fetch dashboard data' });
//     }
// };
// Dashboard Controller

exports.getUserDashboard = async (req, res) => {
    try {
        const firebaseUid = req.user.uid; // User's Firebase UID
        const user = await knex('users').where({ firebase_auth_id: firebaseUid }).first();
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch all contestant data for the user
        const contestantData = await knex('contestants').where({ user_id: user.id });

        res.json({
            user: {
                id: user.id,
                email: user.email
            },
            contestants: contestantData // Include the contestant data in the response
        });

    } catch (error) {
        console.error('Error fetching user dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};
