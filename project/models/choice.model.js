const mongoose = require('mongoose');

const Schema = mongoose.Schema

const schema = new Schema({
  _id: mongoose.ObjectId,
  description: String,
  isCorrect: Boolean,
});


const Choice = mongoose.model('Choice', schema, "Choice");

module.exports = Choice;