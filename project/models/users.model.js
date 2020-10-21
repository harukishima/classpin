const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  _id: mongoose.ObjectId,
  namelogin: String,
  name: String,
  password: String,
  email: String,
  phone: String,
});


const User = mongoose.model('User', schema);

module.exports = User;
