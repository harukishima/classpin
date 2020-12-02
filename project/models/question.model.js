const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  description: String,
  listChoice: Array,
  index: Number,
  correctAnswer: String,
  points: Number,
});


const Question = mongoose.model('Question', schema, 'Question');

module.exports = Question;