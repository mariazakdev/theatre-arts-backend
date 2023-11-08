const knex = require('knex')(require('../knexfile'));

exports.createUser = async (req, res) => {
    try {
      const { email, firstName, lastName, firebaseAuthId, isContestant } = req.body;
      const newUser = {
        firebase_auth_id: firebaseAuthId,
        email: email,
        first_name: firstName,
        last_name: lastName,
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