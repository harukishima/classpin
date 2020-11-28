const Classroom = require('../models/class.model');
const User = require('../models/users.model');
const Exercise = require('../models/Exercise.model');
const mongoose = require('mongoose');
const shortid = require('shortid');

module.exports.index = async (req, res) => {
  var passedVariable = req.query.status;
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
    allClass: allclass,
    msg: passedVariable
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
  try {
    const user = await User.findById({_id: req.signedCookies.userId});
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
    await newClass.save();
    var string = encodeURIComponent("createsuccess");
    res.redirect('/class' + '/?status=' + string);
  } catch (err) {
    var string = encodeURIComponent("fail");
    res.redirect('/class' + '/?status=' + string);
  }
};

module.exports.classControl = async (req, res) => {
  const classroom = await Classroom.findById({_id: req.params.id});
  const teacher = await User.findById({_id: classroom.teacher});
  res.render('class/classcontrol', {
    classroom: classroom,
    teacher: teacher
  });
};

module.exports.search = async (req, res) => {
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
    const matchedClass = await Classroom.findOne({joinId: req.body.id_class});
    if(!matchedClass) {
      res.render('class/enroll', {
        msg: "Class doesn't exist",
        value: req.body.id_class,
      });
      return;
    }
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


module.exports.getDelete = async (req, res) => {
  var classId = req.params.id;
  const matchedClass = await Classroom.findOne({_id: classId});

  res.render('class/deleteClass', {
    matchedClass: matchedClass
  })
}

module.exports.postDelete = async (req, res) => {
  
  const value = req.body.q;
  const classId = req.params.id;
  if(value) {
    const teacher = await User.findById({_id: req.signedCookies.userId});
    
    const matchedClass = await Classroom.findById({_id: classId});
    
    if(teacher._id.toString() === matchedClass.teacher.toString()) {
      Classroom.deleteOne({_id: matchedClass._id}, function(err) {
        if(err) {
          console.error(err);
        }
        console.log('success');
        var string = encodeURIComponent("success");
        res.redirect('/class'+ '/?status=' + string);
      })
      return;
    }
  }
  // Khi khong co quyen
  res.redirect('/class'+ '/?status=' + 'fail');
}

module.exports.allMembers = async (req, res) => {
  const classId = req.params.id;
  console.log(classId);
  const matchedClass = await Classroom.findById({_id: classId});
  const allMembers = await User.find({_id: {$in : matchedClass.listusers}});
  const teacher = await User.findById({_id: matchedClass.teacher});
  console.log(allMembers);
  res.render('class/allMembers', {
    allMembers : allMembers,
    classroom : matchedClass,
    teacher: teacher
  });
}

module.exports.exercise = async (req, res) => {
  const classId = req.params.id;
  console.log(classId);
  const matchedClass = await Classroom.findById({_id: classId});
  
  const teacher = await User.findById({_id: matchedClass.teacher});
  res.render('class/exercise', {
    classroom : matchedClass,
    teacher : teacher,
  });
}

module.exports.createExercise = async (req, res) => {
  const classId = req.params.id;
  console.log(classId);
  const matchedClass = await Classroom.findById({_id: classId});
  const teacher = await User.findById({_id: matchedClass.teacher});
  res.render('class/formCreateExercise', {
    classroom : matchedClass,
    teacher : teacher,
  })
}

module.exports.postCreateEx = async (req, res) => {
  console.log(req.body);
  const dateBegin = req.body.datebegin + " " + req.body.timebegin;
  const dateEnd = req.body.dateend + " " + req.body.timeend;
  const newExercise = new Exercise();
  newExercise._id = mongoose.Types.ObjectId();
  newExercise.title = req.body.title;
  newExercise.description = req.body.description;
  newExercise.dateBegin = new Date(dateBegin);
  console.log(newExercise.dateBegin);
  newExercise.dateEnd = new Date(dateEnd);
  newExercise.time = req.body.time;
  newExercise.save(function(err) {
    if(err) {
      console.log(err);
    }
    //saved
  })
}