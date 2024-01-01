const knex = require('knex')(require('../knexfile'));


exports.loginUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Use the provided email to find the user in the database
    const user = await knex('users').where({ email }).first();

    if (user) {
      // Respond with a 200 status and user ID on successful login
      res.status(200).json({ userId: user.id, message: "User logged in successfully" });
    } else {
      // Respond with a 404 status if the user is not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    // Respond with a 500 status for internal server error
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getUserById = async (userId) => {
  try {
    // Get the user from the logged-in firebase user table
    const user = await knex('users').where({ id: userId }).first();

    if (!user) {
      throw new Error("User not found");
    }

    // Find matching user_id in contestants table
    const contestant = await knex('contestants').where({ user_id: userId }).first();

    if (!contestant) {
      throw new Error("Contestant not found");
    }

    return { user, contestant };
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
};

// exports.getUserById = async (req, res, next) => {
//   try {
//       // Get the user ID from the request parameters
//     const userId = req.params.id;

//     // Get the user from the logged in firebase user table
//     const user = await knex('users').where({ firebase_auth_id: 'fAuthId1' }).first();
//     // const user = await knex('users').where({ id: userId }).first();

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Find matching user_id in contestants table
//     const contestant = await knex('contestants').where({ user_id: user.id }).first();

//     if (!contestant) {
//       return res.status(404).json({ error: "Contestant not found" });
//     }

//     res.status(200).json({ user, contestant });
//   } catch (error) {
//     console.error(error);

//     // Check if next is a function before calling it
//     if (typeof next === 'function') {
//       next(error);
//     } else {
//       // If next is not a function, log the error and send a generic response
//       console.error("Error in getUserById:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// };


exports.createUser = async (req, res, next) => {
    try {
      const { email, firebaseAuthId, isContestant } = req.body;
      const newUser = {
        firebase_auth_id: firebaseAuthId,
        email: email,
        is_contestant: isContestant 
      };
  
      // The 'newUser' object should not be a string
      const [userId] = await knex('users').insert(newUser);
  
      // Status 201 is more appropriate for a successful creation of a resource
      res.status(201).json({ userId: userId, message: "User created successfully" });


    } catch (error) {
      logger.error(`Error in createUser: ${error.message}`, { stack: error.stack, requestId: req.id });

        next(error);
    }
  }


  exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await knex('users').select("*");
      res.status(200).json(users); 
    } catch (error) {
      logger.error(`Error in getAllUsers: ${error.message}`, { stack: error.stack, requestId: req.id });
      next(error);
    }
  }



  exports.checkUserExistence = async (req, res, next) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await knex('users').where({ email: email }).first();
        const exists = !!user;
        res.status(200).json({ exists: exists });
    } catch (error) {
      logger.error(`Error in checkUserExistence: ${error.message}`, { stack: error.stack, requestId: req.id });
      
      next(error);
    }
};
exports.sendErrorResponse = (res) => {
  const statusCode = 500;
  const errorImageUrl = `https://http.cat/${statusCode}`;
  res.status(statusCode).json({
      error: "Server Issues. Message from backend 'Users'",
      errorUrl: errorImageUrl
  });
};