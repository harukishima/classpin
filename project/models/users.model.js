const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Userschema = new Schema({
  _id: mongoose.ObjectId,
  namelogin: String,
  name: String,
  password: String,
  email: String,
  phone: String,
  avatar: String
});


const User = mongoose.model('User', Userschema, 'users');

module.exports = User;
