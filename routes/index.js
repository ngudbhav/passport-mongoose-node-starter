var express = require('express');
var router = express.Router();

var passport = require('passport');
require('express-validator');
var bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('ngudbhavisTheCorseDeveloperOFThisPortal!');
const saltRounds = 10;

var auth_user = require('../models/auth_user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message: req.flash('message')});
});
router.post('/register', function(req, res ,next){
	bcrypt.hash(req.body.password, saltRounds, function(error, hash){
		if(error) throw error;
		else{
			var ob = {
				name:req.body.name,
				email:req.body.email,
				password:hash,
				blood: req.body.blood,
				city: req.body.city,
				state:req.body.state,
				address:req.body.address
			};
			auth_user.create(ob, function(error, results){
				if(error) throw error;
				else{
					res.redirect('/');
				}
			});
		}
	});
});
router.post('/login', passport.authenticate('local', {
	failureRedirect: '/',
	failureFlash : true
}), function(req, res){
	res.redirect('/profile');
});
router.get('/logout', function(req, res, next){
	req.logout;
	req.session.destroy();
	res.redirect('/');
});

passport.serializeUser(function(user_id, done){
	done(null, user_id);
});
passport.deserializeUser(function(user_id, done){
	done(null, user_id);
});
function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
	    if (req.isAuthenticated()) return next();
	    res.redirect('/')
	}
}
module.exports = router;
