const express = require('express');
var multer = require('multer')

const router = express.Router();
const controller = require('../controller/class.controller');
const exerciseActive = require('../middleware/exerciseActive.middleware');
const memberActive = require('../middleware/memberActive.middleware');
const notifyActive = require('../middleware/notifyActive.middleware');
const documentActive = require('../middleware/documentActive.middleware');
const overviewActive = require('../middleware/overviewActive.middleware');
// const localsClassTeacher = require('../middleware/localClassTeacher.middleware');
const teacherMiddleware = require('../middleware/requireTeacher.middleware');
const studentMiddleware = require('../middleware/requireStudent.middleware');

// Chỉ định vị trí lưu file vào ext
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/pdf/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.pdf');
  }
});

var upload = multer({ storage: storage });


router.get('/', controller.index);

//create class
router.get('/create', controller.create);
router.post('/create', controller.postCreate);


//enroll class
router.get('/enroll', controller.enroll);
router.post('/enroll', controller.postEnrollClass);

//search for class
router.get('/search', controller.search);
router.get('/:id', overviewActive.localsActive, controller.classControl);

//delete class
router.get('/delete/:id', teacherMiddleware.requireTeacher, controller.getDelete);
router.post('/delete/:id', teacherMiddleware.requireTeacher, controller.postDelete);


//class management
router.get('/:id/members', teacherMiddleware.requireTeacher, memberActive.localsActive, controller.allMembers);
router.get('/:id/exercise', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.exercise);
router.get('/:id/exercise/create', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.createExercise);
router.post('/:id/exercise/create', teacherMiddleware.requireTeacher, exerciseActive.localsActive, upload.single('pdf'), controller.postCreateEx);
router.get('/:id/exercise/:idex', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.allQuestion);
router.get('/:id/exercise/:idex/fileExam', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.reviewPDF);
router.get('/:id/exercise/:idex/addQuestion', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.addQuestion);
router.post('/:id/exercise/:idex/addQuestion', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.postNumberQuestion);
router.post('/:id/exercise/:idex/postCreateQuestion', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.postCreateQuestion);
router.post('/:id/exercise/:idex/publish', teacherMiddleware.requireTeacher, exerciseActive.localsActive, controller.publishEx);


// router student
router.get('/:id/student', studentMiddleware.requireStudent, overviewActive.localsActive, controller.studentClass);
router.get('/:id/student/exercise', studentMiddleware.requireStudent, exerciseActive.localsActive, controller.studentAllExercise);
router.get('/:id/student/members', studentMiddleware.requireStudent, memberActive.localsActive, controller.allStudentMembers);


module.exports = router;