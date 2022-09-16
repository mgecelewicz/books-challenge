const express = require('express');
const mainRouter = require('./routes/main');
const session = require('express-session');
const app = express();
const cookies = require('cookie-parser');
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

// SESSION
app.use(session ({
  secret: 'digitalhouse',
  resave: false,
  saveUninitialized: false
}));

//Middleware de aplicación
app.use(userLoggedMiddleware);

app.use(cookies());

app.use('/', mainRouter);


app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
