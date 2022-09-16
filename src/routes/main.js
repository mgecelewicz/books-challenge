const express = require('express');
const mainController = require('../controllers/main');
const { body, check} = require('express-validator'); //se instala con npm i express-validator
const authMiddleware = require('../middlewares/authMiddleware');;
const loggedMiddleware = require("../middlewares/loggedMiddleware");
const userLoggedMiddleware = require("../middlewares/userLoggedMiddleware");

const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', userLoggedMiddleware, mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
router.get("/users/login", loggedMiddleware, mainController.login);
router.post("/users/login", userLoggedMiddleware, mainController.processLogin);
router.get('/users/profile',mainController.profile);
router.get('/users/logout', mainController.logout);
/*[body('fullName').notEmpty().withMessage('Tienes que escribir un nombre'),
body('email')
    .notEmpty().withMessage('Tienes que escribir un correo electrónico').bail()
    .isEmail().withMessage('Debes escribir un formato de correo válido'),
body('password')
    .notEmpty().withMessage('Tienes que escribir una contraseña').bail()
    .isLength({min:8}).withMessage('La contraseña tiene que tener mínimo 8 caracteres')
]*/

router.get('/books/edit/:id', mainController.edit);
router.post('/books/edit/:id', mainController.processEdit);
router.post('/books/detail/:id', mainController.deleteBook);

module.exports = router;
