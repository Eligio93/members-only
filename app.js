var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./passport-config')
const MongoStore = require('connect-mongo')
const helmet = require('helmet')
const compression =require('compression')
require('dotenv').config();



///-----CONNECTION TO DB-----///

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || process.env.DB_STRING;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('connesso al database')
}
///---------------------------///


//create the app
var app = express();
app.use(compression());
app.use(helmet());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///-----CREATE SESSION-----///
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || process.env.DB_STRING })
}))

app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.user=req.user;
  next();
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


app.use('/', indexRouter);
app.use('/users', usersRouter);



///----- HANDLING ERRORS-----///

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
