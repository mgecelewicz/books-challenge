const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Op } = require("sequelize");
const {validationResult} = require('express-validator');
const session = require('express-session');
const { ResultWithContext } = require('express-validator/src/chain');


const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books:books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    db.Book.findByPk(req.params.id, 
    {include: [{ association: 'authors' }]})
    .then(function(books, authors) {    
    res.render('bookDetail', { books:books})});
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    db.Book.findAll({
      where: { title: { [Op.like]: "%" + req.body.title + "%" } },
    }).then(function(books) { console.log(books)
    res.render('search', { books: books });
  }
    )},
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    db.Author.findByPk((req.params.id), {
      include: [{ association: 'books' }, ]
    })
    .then(function(authors) {
      console.log(authors.books)
    res.render('authorBooks', {authors: authors})
  });
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('login');
      })
      .catch((error) => console.log(error));
  
   const resultValidation = validationResult(req);

		if (resultValidation.errors.length > 0) {
			return res.render('register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			})
    }     
  },
  login: (req, res) => {
    res.render('login');
  },
  processLogin: (req, res) => {
    let userToLogin = db.User.findOne({
      where: { email: req.body.email},
    })
    .then (function(userToLogin) {
     if(userToLogin) {
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.Pass);
			
      if(isOkThePassword) {
		  delete userToLogin.password;
			req.session.userLogged = userToLogin;
  
      
    if (req.body.remember_user) {
        res.cookie("userEmail", req.body.email, {
          maxAge: 10 * 60 * 60,
        });
      }
     
      res.redirect('profile');
    } else {

     return res.render('login', {
			errors: 
      {email: {msg: 'El mail no se encuentra en la base de datos'},
      password: {msg: 'Las credenciales son inválidas'}}
		})}
  }}
    )}, 
profile: (req, res) => {
  userToLogin = req.session.userLogged;
  return res.render('profile', {userToLogin: userToLogin})
  
},
logout: (req, res) => {
  res.clearCookie('userEmail');
  req.session.destroy();
  res.redirect ('login')
},

edit: (req, res) => {
   let book = db.Book.findByPk(req.params.id) 
   .then(function(book) {     
   res.render('editBook', {book: book})
  })
},

 processEdit: (req, res) => {
    db.Book.update ({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description
    }, {
      where: {id: req.params.id}
    })
    res.redirect('/books/detail/' + req.params.id);
  },
  deleteBook: (req, res) => {
    db.BooksAuthors.destroy ({where: {Bookid: req.params.id}})
    .then (() => {
      db.Book.destroy ({where: {id: req.params.id}})
    }) .then (() => {
      return res.redirect('/')
    }) 
  }

  };
  
module.exports = mainController;
