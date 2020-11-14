const Classroom = require('../models/class.model');
const User = require('../models/users.model');
const mongoose = require('mongoose');
const shortid = require('shortid');

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
  res.render('class/index', {
    allClass: allclass
  })

}

module.exports.create = (req, res) => {
  res.render('class/create');
}

module.exports.enroll = (req, res) => {
  res.render('class/enroll', {

  });
}

module.exports.postCreate = async (req, res) => {
  const user = await User.findById({_id: req.signedCookies.userId});
  console.log(req.body);
  const newClass= new Classroom();
  newClass._id = mongoose.Types.ObjectId();
  newClass.classname = req.body.classname;
  newClass.datebegin = new Date;
  newClass.subject = req.body.subject,
  newClass.joinId = shortid.generate();
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

// function enroll a class
module.exports.postEnrollClass = async (req, res) => {
  try {

    // find class with ID
    console.log(req.body.id_class);
    const matchedClass = await Classroom.findOne({joinId: req.body.id_class});
    if(!matchedClass) {
      res.render('class/enroll', {
        msg: "Class doesn't exist",
        value: req.body.id_class,
      });
      return;
    }
    console.log(matchedClass);
    // find user
    const user = await User.findById({_id: req.signedCookies.userId});
    
    
    if(matchedClass.teacher.toString() === user._id.toString()) {
      res.render('class/enroll', {
        msg: "This is your class!",
        value: req.body.id_class,
      });
      return;
    }
  
    //kiem tra user da tham gia class
  
    const found = matchedClass.listusers.find(function(element) {
      return element.toString() === user._id.toString();
    });

    if(found) {
      res.render('class/enroll', {
        msg: "You aready in this class!",
        value: req.body.id_class,
      });
      return;
    }
    
    // Them user vao lop hoc
    matchedClass.listusers.push(user._id);
    matchedClass.save(function(err) {
      if(err) {
        return handleError(err);
      }
      console.log("Success!");
    })
    res.redirect('/class/' + matchedClass._id);
  } catch (error) {
    console.log(error);
  }
  
}