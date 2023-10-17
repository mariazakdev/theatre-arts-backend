const knex = require('knex')(require('../knexfile'));

exports.uploadData = async (req, res) => {
    try {
        const { firebaseId, photoUrl, videoUrl, description, name } = req.body;
        const [user] = await knex('users').where({ firebase_auth_id: firebaseId });
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        const [id] = await knex('contestants').insert({
            user_id: user.id,
            url_photo: photoUrl,
            url_video: videoUrl,
            description,
            votes: 0
        });

        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload' });
    }
};

exports.getAllContestants = async (req, res) => {
    try {
        const contestants = await knex('contestants').select();
        res.json(contestants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve contestants' });
    }
};

// ... Add more controller functions as needed ...
