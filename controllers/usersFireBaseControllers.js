const knex = require('knex')(require('../knexfile'));

exports.createUser = async (req, res) => {
    try {
      const { email, firebaseAuthId, isContestant } = req.body;
      const newUser = {
        firebase_auth_id: firebaseAuthId,
        email: email,
        is_contestant: isContestant // Assuming this comes from the front end
      };
  
      // The 'newUser' object should not be a string
      const [userId] = await knex('users').insert(newUser);
  
      // Status 201 is more appropriate for a successful creation of a resource
      res.status(201).json({ userId: userId, message: "User created successfully" });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      const statusCode = 500; // Server error status code
      const errorImageUrl = `https://http.cat/${statusCode}`;
      res.status(statusCode).json({
        error: "Server Issues. Message from backend 'Users'",
        errorUrl: errorImageUrl 
      });
    }
  }
  


  exports.getAllUsers = async (req, res) => {
    try {
      const users = await knex('users').select("*");
      res.status(200).json(users); 
    } catch (error) {
      console.error(error); // It's good practice to log the actual error for debugging purposes
      const statusCode = 500; // Server error status code
      const errorImageUrl = `https://http.cat/${statusCode}`;
      res.status(statusCode).json({
        error: "Server Issues. Message from backend 'Users'",
        errorUrl: errorImageUrl 
      });
    }
  }

  exports.checkUserExistence = async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await knex('users').where({ email: email }).first();
        const exists = !!user;
        res.status(200).json({ exists: exists });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error while checking user existence"
        });
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