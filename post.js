// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Create Express app
const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: ' ',
    database: 'userdatabase'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// API endpoint for retrieving user details by email
app.post('/', (req, res) => {
  // Get email from the request body
  const { email } = req.body;

  // Validate if the email is provided
  if (!email) {
    return res.status(400).json({ error: 'Email is required in the request body.' });
  }

  // Query to retrieve user details from 'user' and 'user_information' tables
  const query = `
    SELECT user.*, user_information.*
    FROM user
    JOIN user_information ON user.id = user_information.user_id
    WHERE user.email = ?;
  `;

  // Execute the query
  pool.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if user with the provided email exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user details as a response
    const userDetails = results[0];
    res.status(200).json({ userDetails });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
