const db = require('../database/models');

function userLoggedMiddleware(req, res, next) {

	//let emailInCookie = req.cookies.userEmail;

	res.locals.isLogged = false;

	if (req.session.userLogged) {
		res.locals.isLogged = true;
		res.locals.userLogged = req.session.userLogged;
	}

	//let userFromCookie = User.findOne('email', emailInCookie);
	
	/*if (userFromCookie) {
		req.session.userLogged = userFromCookie;
	}*/

	next();
}

module.exports = userLoggedMiddleware;