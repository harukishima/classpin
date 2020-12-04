const User = require('../models/users.model');
const Classroom = require('../models/class.model');
const mongoose = require('mongoose');

module.exports.requireStudent = async (req, res, next) => {
  const classroom = await Classroom.findById({_id: req.params.id});
  const userId = mongoose.Types.ObjectId(req.signedCookies.userId);
  const teacher = await User.findById({_id: classroom.teacher});
  if(classroom.listusers.indexOf(userId) === -1) {
    res.redirect('/');
  } else {
    res.locals.classroom = classroom;
    res.locals.teacher = teacher;
    next();
  }
}