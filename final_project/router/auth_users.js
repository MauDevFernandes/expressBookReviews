const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { id: 1, username: 'maudias', password: 'finalproject' },
    { id: 2, username: 'maufernandes', password: 'finalproject2' }

];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Assuming the username is stored in the session
    const review = req.body.review;
  
    // Check if the user is authenticated
    if (!username) {
        return res.status(401).json({ message: "User not authenticated." });
    }
  
    // Check if review text is provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }
  
    // Check if the book exists in the database
    const foundBook = Object.values(books).find(book => book.isbn === isbn);
    if (!foundBook) {
        return res.status(404).json({ message: "Book not found" });
    }
  
    // Ensure that the book has a reviews property and initialize it if it doesn't exist
    foundBook.reviews = foundBook.reviews || {};
  
    // Add or modify the review
    foundBook.reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/modified successfully." });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Assuming the username is stored in the session
    const book = books[req.params.isbn];
    // Check if the user is authenticated
    if (!username) {
        return res.status(401).json({ message: "User not authenticated." });
    }
    const foundBook = Object.values(books).find(book => book.isbn === isbn);
    if (isbn) {
        // Delete review from 'book' object based on provided isbn
        delete foundBook.review[username];
    }
    
    // Send response confirming deletion of friend
    res.send(`review from user on the book with the isbn ${isbn} deleted.`);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
