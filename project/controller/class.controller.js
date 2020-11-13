const Classroom = require('../models/class.model');
const User = require('../models/users.model');
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
  const allclass = await Classroom.aggregate([
    {
      $lookup:
        {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacher_info"
        }
    }
  ]);
  console.log(allclass);
  res.render('class/index', {
    allClass: allclass
  })

}

module.exports.create = (req, res) => {
  res.render('class/create', {

  });
}

module.exports.enroll = (req, res) => {
  res.render('class/enroll', {

  });
}

module.exports.postCreate = async (req, res) => {
  const user = await User.findById({_id: req.signedCookies.userId});
  const newClass= new Classroom();
  newClass._id = mongoose.Types.ObjectId();
  newClass.classname = req.body.classname;
  newClass.datebegin = new Date;
  newClass.listusers.push(user._id);
  newClass.teacher = user._id;
  newClass.description = req.body.description;
  newClass.subject = req.body.subject;
  console.log(newClass);
  await newClass.save();
  res.redirect('/class');
};

module.exports.classControl = async (req, res) => {
  console.log(req.params.id);
  const classroom = await Classroom.findById({_id: req.params.id});
  console.log(classroom);
  res.render('class/classcontrol', {
    classroom: classroom
  });
};

module.exports.search = async (req, res) => {
  console.log(req.query);
  var q = req.query.q;
  const allClass = await Classroom.aggregate([
    {
      $lookup:
        {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacher_info"
        }
    }
  ]);
  console.log(allClass);
  var matchedClass = allClass.filter(function(x) {
    return x.classname.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render('class/index', {
    allClass: matchedClass,
    value: q,
  });
};