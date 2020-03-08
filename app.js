var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lectureRouter = require('./routes/lectures');

var app = express();

var url = process.env.DATABASEURL || "mongodb://localhost/skynetLocalDB";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(fileUpload());

/* PASSPORT CONFIGURATION */
app.use(require("express-session")({
  secret: "We should use a hash or some secret phrase instead of this statement",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(request, response, next){
  response.locals.loggedinUser = request.user;
  response.locals.error = request.flash("error");
  response.locals.message = request.flash("message");
  response.locals.title = 'Skynet ';
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lectures', lectureRouter);

// catch 404 and forward to error handler
app.use(function(request, response, next) {
  next(createError(404));
});

// error handler
app.use(function(err, request, response) {
  // set locals, only providing error in development
  response.locals.message = err.message;
  response.locals.error = request.app.get('env') === 'development' ? err : {};

  // render the error page
  response.status(err.status || 500);
  response.render('error');
});

module.exports = app;
