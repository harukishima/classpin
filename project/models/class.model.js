const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Classschema = new Schema({
  _id: mongoose.ObjectId,
  classname: String,
  listusers: Array,
  teacher: mongoose.ObjectId,
  datebegin: Date,
});


const Classroom = mongoose.model('Classroom', Classschema, 'Classroom');

module.exports = Classroom;
