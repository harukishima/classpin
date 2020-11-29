const Classroom = require('../models/class.model');
const User = require('../models/users.model');

module.exports.localsClassTeacher = async (req, res, next) => {
  const matchedClass = await Classroom.findById({_id: req.params.id});
  const teacher = await User.findById({_id: matchedClass.teacher});
  res.locals.classroom = matchedClass;
  res.locals.teacher = teacher;
  next();
}