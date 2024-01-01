const knex = require('knex')(require('../knexfile'));

const getDashboardData = async (userId) => {
  try {
    // Fetch user data from MySQL
    const userData = await knex('users').where({ firebase_uid: userId }).first();

    if (!userData) {
      return { error: 'User not found.' };
    }

    // Fetch contestant data from MySQL based on user ID
    const contestantData = await knex('contestants').where({ user_id: userData.id }).first();

    if (!contestantData) {
      return { error: 'Contestant data not found.' };
    }

    // Combine user and contestant data
    const combinedData = {
      userId: userData.id,
      email: userData.email,
      contestantData: {
        // Include contestant data fields
        // For example: field1: contestantData.field1, field2: contestantData.field2
      },
    };

    return { data: combinedData };
  } catch (error) {
    console.error(error);
    return { error: 'Internal server error.' };
  }
};

module.exports = { getDashboardData };

























// const firebase = require('firebase');
// const knex = require('knex')(require('../knexfile'));


// // Controller function to get data from Firebase and MySQL
// const getData = async (req, res) => {
//   try {
//     // Get the user ID from the request
//     const userId = req.params.userId;

//     // Retrieve data from Firebase using the user ID
//     const firebaseData = await firebase.database().ref(`users/${userId}`).once('value');
//     const firebaseUser = firebaseData.val();

//     // Retrieve matching data from the contestants table in MySQL using Knex
//     const contestantsData = await knex('contestants').where('user_id', userId);

//     // Combine the data from Firebase and MySQL
//     const combinedData = {
//       firebaseUser,
//       contestantsData
//     };

//     // Send the combined data to the frontend
//     res.json(combinedData);
//   } catch (error) {
//     // Handle any errors
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   getData
// };

// const knex = require("knex")(require("../knexfile"));
// const { validationResult } = require("express-validator");

// exports.getUserDashboard = async (req, res, next) => {
//   const errors = validationResult(req);
//   console.log('Response Status Code:', res.statusCode);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const transaction = await knex.transaction();

//   try {
//     const firebaseUid = req.user.uid;

//     // Fetch user data from the database
//     const user = await knex("users")
//       .transacting(transaction)
//       .where({ firebase_auth_id: firebaseUid })
//       .first();

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Fetch contestant data from the database
//     const contestantData = await knex("contestants")
//       .transacting(transaction)
//       .where({ user_id: user.id });

//     if (!contestantData || contestantData.length === 0) {
//       return res.status(404).json({ error: "Contestant data not found" });
//     }

//     await transaction.commit();

//     res.json({
//       user: {
//         id: user.id,
//         email: user.email,
//       },
//       contestants: contestantData,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     logger.error(`Error in getUserDashboard: ${error.message}`, {
//       userId: req.user && req.user.uid,
//     });

//     next(error);
//   }
// };

