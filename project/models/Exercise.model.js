const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  _id: mongoose.ObjectId,
  title : String,
  listQuestion: Array,
  description: String,
  dateBegin: { type: Date, default: Date.now()},
  examFile: String,
  dateCreated: { type: Date, default: Date.now()},
  dateEnd: Date,
  time: Number,
  status: String,
  numberOfQuestions: Number,
});


const Exercise = mongoose.model('Exercise', schema, 'Exercise');

module.exports = Exercise;