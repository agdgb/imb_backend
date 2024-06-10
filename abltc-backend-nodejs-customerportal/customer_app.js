// Importing necessary libraries and modules
const mongoose = require('mongoose');            // MongoDB ODM library
const Customers = require('./customer');         // Imported MongoDB model for 'customers'
const express = require('express');              // Express.js web framework
const bodyParser = require('body-parser');       // Middleware for parsing JSON requests
const path = require('path');                    // Node.js path module for working with file and directory paths
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Added JWT library
const saltRounds = 5;
const secretKey = '1234!@#$AbAcDkhkuVMHfgu687JHGJHvfjhcjGJ';  // Replace with a secure secret key

let usersdic = {};


// Creating an instance of the Express application
const app = express();

// Setting the port number for the server
const port = 3000;

// MongoDB connection URI and database name
const uri =  "mongodb://localhost:27017";
mongoose.connect(uri, {'dbName': 'customerDB'});

// Middleware to parse JSON requests
app.use("*", bodyParser.json());

// Serving static files from the 'frontend' directory under the '/static' route
app.use('/static', express.static(path.join(".", 'frontend')));

// Middleware to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint for user login
/* app.post('/api/register', async (req, res) => {
    const data = req.body;
    console.log(data);

    let user_name = data['user_name'];
    let password = data['password'];
    let email = data['emial']
    let age = data['age']

    // Querying the MongoDB 'customers' collection for matching user_name and password
    const documents = await Customers.find({ user_name: user_name, password: password });
    const newUser =  new Customers(){

    }

    // If a matching user is found, set the session username and serve the home page
    if (documents.length > 0) {
        var result = await bcrypt.compare(password, documents.password)
        if (!result) {
            res.status(400).send({message: 'Invalid credentials'})
            return
        }
        const token = jwt.sign({id: documents.user_name, username: documents.username}, secretKey)
        res.send(token);
    } else {
        res.send("User Information incorrect");
    }
});
*/

// POST endpoint for user login
app.post('/api/login', async (req, res) => {
    const data = req.body;
    console.log(data);
 
    const user_name = data['user_name'];
    const password = data['password'];
 
    const user = usersdic[user_name];
    if (!user || !(await bcrypt.compare(password, user.hashedpwd))) {
        res.status(401).send('User Information incorrect');
        return;
    }
 
    // No need to print details to the terminal, just send a success message
    res.status(200).send(jwt.sign({user_name: user_name}, secretKey));
});

// POST endpoint for adding a new customer
app.post('/api/add_customer', async (req, res) => {
    const data = req.body;
    console.log(data);
 
    const documents = await Customers.find({ user_name: data['user_name'] });
    if (documents.length > 0) {
        res.status(409).send('User already exists');
        return;
    }
 
    const hashedpwd = await bcrypt.hash(data['password'], saltRounds);
    usersdic[data['user_name']] = { hashedpwd };
 
    // Creating a new instance of the Customers model with data from the request
    const customer = new Customers({
        user_name: data['user_name'],
        age: data['age'],
        password: hashedpwd,
        email: data['email'],
    });
 
    // Saving the new customer to the MongoDB 'customers' collection
    await customer.save();
 
    res.status(201).send('Customer added successfully');
});

// GET endpoint for the root URL, serving the home page
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
