var mongoose = require('mongoose');

var auth_user = new mongoose.Schema({
	name:String,
	email:String,
	password:String,
	blood:String,
	city:String,
	state: String,
	address:String
});

module.exports = mongoose.model('auth_user',auth_user,'auth_user');