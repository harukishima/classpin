const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Classschema = new Schema({
  _id: mongoose.ObjectId,
  classname: String,
  listusers: Array,
  teacher: mongoose.ObjectId,
  subject: String,
  joinId: String,
  datebegin: { type: Date, default: Date.now },
  description: String,
});


const Classroom = mongoose.model('Classroom', Classschema, 'Classroom');

module.exports = Classroom;
