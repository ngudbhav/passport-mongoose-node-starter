var createError = require('http-errors');
var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var moment = require('moment');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var app = express();

var config = require('./config/database');
mongoose.connect(config.database);
mongoose.connection.on('connected',()=>{
  console.log('connected to database');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var sessionMiddleware = session({
  secret: 'uygugujbjbiubub',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

passport.use(new LocalStrategy({passReqToCallback: true},
	function(req, username, password, done) {
		auth_user.findOne({"email":username}, function(error, results){
			if(error){
				return done(error);
			}
			else{
				if(!results){
					return done(null, false, req.flash('error', 'Account does not exist!'));
				}
				else{
					var hash = results.password.toString();
					bcrypt.compare(password, hash, function(error, response){
						if(error || !response){
							console.log(error);
							return done(null, false, req.flash('error', 'Invalid Credentials'));
						}
						else if(response){
							return done(null, {user_id: results.id});
						}
					});
				}
			}
		});
	}
));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
