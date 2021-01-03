const Classroom = require('../models/class.model');
const User = require('../models/users.model');
const Exercise = require('../models/Exercise.model');
const Question = require('../models/question.model');
const Choice = require('../models/choice.model');
const mongoose = require('mongoose');
const shortid = require('shortid');
var moment = require('moment'); // require

module.exports.index = async (req, res) => {
  var passedVariable = req.query.status;
  // Tim lop hoc cua user
  var objectId = mongoose.Types.ObjectId(req.signedCookies.userId);
  const allclass = await Classroom.aggregate([
    {
      $match: {listusers: {$all : [objectId]}}
    },
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
  var passedVariable = req.query.enroll;
  const classroom = await Classroom.findById({_id: req.params.id});
  const userId = mongoose.Types.ObjectId(req.signedCookies.userId);
  
  if(classroom.listusers.indexOf(userId) === -1) {
    var string = encodeURIComponent("noPermission");
    res.redirect('/class/' + '?status=' + string);
  }
  
  const teacher = await User.findById({_id: classroom.teacher});
  console.log(userId);
  console.log(teacher);
  if(teacher._id.toString() === userId.toString()) {
    res.render('class/classcontrol', {
      classroom: classroom,
      teacher: teacher,
      passedVariable: passedVariable,
    });
  }
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
    var string = encodeURIComponent('success');
    res.redirect('/class/' + matchedClass._id + '/student/?enroll=' + string);
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
  //console.log(classId);
  const allMembers = await User.find({_id: {$in : res.locals.classroom.listusers}});
  //console.log(allMembers);
  res.render('class/allMembers', {
    allMembers : allMembers,
  });
}

module.exports.exercise = async (req, res) => {
  const classroom = res.locals.classroom;
  const pendingExercise = await Exercise.find({_id: {$in : classroom.listExam}, status : 'pending'}).sort({dateCreated: -1});
  const publishedExercise = await Exercise.find({_id: {$in : classroom.listExam}, status : 'published', dateBegin: {$lt: Date.now()}}).sort({dateBegin: -1});
  const waitingExercise = await Exercise.find({_id: {$in: classroom.listExam}, status: 'published', dateBegin : {$gt: Date.now()}}).sort({dateBegin: -1});;
  for(var i of pendingExercise) {
    i.date = moment(i.dateCreated);
    //console.log(i.date.fromNow());
  }
  res.render('class/exercise', {
    pendingExercise : pendingExercise,
    waitingExercise : waitingExercise,
    publishedExercise : publishedExercise
  });
}

module.exports.createExercise = async (req, res) => {
  const classId = req.params.id;
  res.render('class/formCreateExercise');
}

module.exports.postCreateEx = async (req, res) => {
  //console.log(req.body);
  const dateBegin = req.body.datebegin + " " + req.body.timebegin;
  const dateEnd = req.body.dateend + " " + req.body.timeend;
  const newExercise = new Exercise();
  newExercise._id = mongoose.Types.ObjectId();
  newExercise.title = req.body.title;
  newExercise.description = req.body.description;
  newExercise.dateBegin = new Date(dateBegin);
  //console.log(newExercise.dateBegin);
  newExercise.dateEnd = new Date(dateEnd);
  newExercise.dateCreated = Date.now();
  newExercise.time = req.body.time;
  if(req.file) {
    newExercise.examFile = req.file.path.split('\\').slice(1).join('\\');
  }
  newExercise.status = "pending";
  await newExercise.save();
  // Them de thi vao lop hoc
  await Classroom.updateOne({_id: req.params.id}, {$addToSet : {listExam : newExercise._id}});
  res.redirect('/class/' + req.params.id + '/exercise');
}

module.exports.allQuestion = async (req, res) => {
  const exerciseId = req.params.idex;
  const exercise = await Exercise.findById({_id: exerciseId});
  const questions = await Question.find({_id: {$in : exercise.listQuestion}});
  res.render('class/question', {
    exercise : exercise,
    questions: questions
  });
}

module.exports.reviewPDF = async (req, res) => {
  const exercise = await Exercise.findById({_id: req.params.idex});
  console.log(exercise.examFile);
  res.render('class/PDF', {
    path : exercise.examFile,
  });
}

// render all questions
module.exports.addQuestion = async (req, res) => {
  const exercise = await Exercise.findById({_id: req.params.idex});
  //const questions = await Question.find({_id: {$in: exercise.listQuestion}});
  res.render('class/addQuestion', {
    exercise : exercise,
    //questions: questions
  });
}

module.exports.postNumberQuestion = async (req, res) => {
  console.log(+req.body.numberOfChoices);
  await Exercise.updateOne({_id: req.params.idex}, {$set: {numberOfQuestions: +req.body.numberOfQuestions, numberOfChoices: +req.body.numberOfChoices}});

  const exercise = await Exercise.findById({_id: req.params.idex});
  res.render('class/formCreateQuestion', {
    numberOfQuestions: +req.body.numberOfQuestions,
    exercise: exercise
  });
}


module.exports.postCreateQuestion = async (req, res) => {
  console.log(req.body);
  const exercise = await Exercise.findById({_id: req.params.idex});

  var listQuestion = [];
  var listIdQuestion = [];
  for(var i=1; i<= exercise.numberOfQuestions; i++) {
    const question = new Question();
    question._id = mongoose.Types.ObjectId();
    question.correctAnswer = req.body.correct[i-1];
    question.index = i;
    listQuestion.push(question);
    listIdQuestion.push(question._id);
  }
  console.log(listQuestion);
  await Question.insertMany(listQuestion);
  await Exercise.updateOne({_id: req.params.idex}, {$set: {listQuestion: listIdQuestion}});
  res.redirect('/class/' + res.locals.classroom._id + '/exercise/' + exercise._id);
}

module.exports.publishEx = async (req, res) => {
  console.log(req.body);
  if(req.body.q === "submit") {
    await Exercise.updateOne({_id: req.params.idex}, {$set: {status: "published"}});
  }
  res.redirect('/class/' + res.locals.classroom._id + '/exercise/');
}


//controller student

module.exports.studentClass = async (req, res) => {
  var passedVariable = req.query.enroll;
  res.render('class/studentcontrol', {
    passedVariable: passedVariable
  })
}

module.exports.studentAllExercise = async (req, res) => {
  const allExercises = await Exercise.find({_id: {$in : res.locals.classroom.listExam}, status: "published"}).sort({dateCreated: -1});
  for(var i of allExercises) {
    i.date = moment(i.dateEnd);
  }
  res.render('class/studentExercise', {
    allExercises : allExercises
  })
}

module.exports.allStudentMembers = async (req, res) => {
  const classId = req.params.id;
  //console.log(classId);
  const allMembers = await User.find({_id: {$in : res.locals.classroom.listusers}});
  //console.log(allMembers);
  res.render('class/allStudentMembers', {
    allMembers : allMembers,
  });
}

module.exports.dotest = async (req, res) => {
  const idEx = req.body.idEx;
  const exercise = await Exercise.findOne({_id: idEx});
  const questions = await Question.find({_id : {$in : exercise.listQuestion}});
  console.log(exercise);
  res.render('class/dotest', {
    exercise: exercise,
    questions: questions,
  })
}

module.exports.postDoTest = async (req, res) => {
  console.log(req.body);
  const exercise = await Exercise.findOne({_id: req.body.idEx});
  const questions = await Question.find({_id : {$in : exercise.listQuestion}});
  console.log(questions);
  var x = 0; //count

  for(var i of questions) {
    
  }
}