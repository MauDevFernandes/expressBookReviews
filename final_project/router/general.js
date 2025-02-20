const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

//task 1 Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,3))
});

// task 10
function getBooksAsync() {
    return new Promise((resolve) => {
      resolve(JSON.stringify(books, null, 3));
    });
  }
public_users.get('/books', async function (req, res) {
    getBooksAsync()
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
  });

//task 2 Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.isbn===isbn);
    if (book) {
      let bookDetails = JSON.stringify(book);
      res.send(`Book found! ISBN ${isbn}: ${bookDetails}`);
    } else {
      res.send(`No book found with the ISBN ${isbn}`);}
 });
  
 //task 11
 function getBookByIsbnAsync(isbn) {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book ISNB was not found.");
      }
    });
  }
  public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByIsbnAsync(isbn).then(bookRecord => {
        return res.send(bookRecord);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  });


//task 3 Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let booksList=Object.values(books)
    let book = booksList.filter(b => b.author===author);
   
      if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(`Books from author ${author}: ${bookDetails}`);
     } else {
       res.send(`there are no books from author ${author}`);}
});

//task 12
function getBookByAuthorAsync(author) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.author == author);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book author was not found.");
      }
    });
  }
  public_users.get('/books/author/:author', function (req, res) {

    const author = req.params.author;
  
    getBookByAuthorAsync(author)
      .then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  });

//task 4 Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.title===title);
   
      if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(`details for the Book ${title}: ${bookDetails}`);
     } else {
       res.send(`there are no books with the title: ${title}`);}
});

//task 13
function getBookByTitleAsync(title) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.title == title);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book title was not found.");
      }
    });
  }
  public_users.get('/books/title/:title', function (req, res) {

    const title = req.params.title;
  
    getBookByTitleAsync(title)
      .then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.isbn===isbn);
    if (book) {
      let reviewList = JSON.stringify(book.reviews);
      res.send(`This are the reviews of the ISBN ${isbn}: ${reviewList}`);
    } else {
      res.send(`No book found with the ISBN ${isbn}`);}
});

module.exports.general = public_users;
