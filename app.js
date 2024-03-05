// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');


// Creating express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: ' ',
    database: 'userdatabase'
});

// Read data from JSON file (users.json)
let usersData = [];
try {
    const data = fs.readFileSync('users.json', 'utf8');
    usersData = JSON.parse(data);
} catch (err) {
    console.error('Error reading or parsing users.json:', err);
}

// Create GET endpoint
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            return res.status(500).send('Internal server error');
        }

        // Insert data into MySQL tables
        usersData.forEach((users) => {
            const {name , address} = users;
            const sqlUser = `INSERT INTO users (name, address) VALUES (?, ?)`;
            // const sqlUserInfo = `INSERT INTO user_2 (id, name, info) VALUES (?, ?)`;

            connection.query(sqlUser, [name , address], (err) => {
                if (err) {
                    console.error('Error inserting  record:', err);
                }
            });

            connection.query(sqlUserInfo, [name, JSON.stringify(userdatabase)], (err) => {
                if (err) {
                    console.error('Error inserting record:', err);
                }
            });
        });

        connection.release();
        res.send('Data inserted successfully!');
    });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

