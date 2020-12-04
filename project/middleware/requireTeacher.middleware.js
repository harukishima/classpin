const User = require('../models/users.model');
const Classroom = require('../models/class.model');
const mongoose = require('mongoose');

module.exports.requireTeacher = async (req, res, next) => {
  const classroom = await Classroom.findById({_id: req.params.id});
  const userId = mongoose.Types.ObjectId(req.signedCookies.userId);
  const teacher = await User.findById({_id: classroom.teacher});
  if(teacher._id.toString() !== userId.toString()) {
    res.redirect('/');
  } else {
    res.locals.classroom = classroom;
    res.locals.teacher = teacher;
    next();
  }
}