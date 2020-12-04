const express = require('express');
var multer  = require('multer')

const router = express.Router();
const controller = require('../controller/class.controller');
const exerciseActive = require('../middleware/exerciseActive.middleware');
const memberActive = require('../middleware/memberActive.middleware');
const notifyActive = require('../middleware/notifyActive.middleware');
const documentActive = require('../middleware/documentActive.middleware');
const overviewActive = require('../middleware/overviewActive.middleware');
const localsClassTeacher = require('../middleware/localClassTeacher.middleware');


// Chỉ định vị trí lưu file vào ext
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/pdf/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.pdf');
  }
});

var upload = multer({storage: storage});

router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/enroll', controller.enroll);
router.post('/create', controller.postCreate);
router.get('/search', controller.search);
router.get('/:id', overviewActive.localsActive, controller.classControl);
router.post('/enroll', controller.postEnrollClass);
router.get('/delete/:id', controller.getDelete);
router.post('/delete/:id', controller.postDelete);
router.get('/:id/members', memberActive.localsActive, localsClassTeacher.localsClassTeacher, controller.allMembers);
router.get('/:id/exercise', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.exercise);
router.get('/:id/exercise/create', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.createExercise);
router.post('/:id/exercise/create', exerciseActive.localsActive, upload.single('pdf') , controller.postCreateEx);
router.get('/:id/exercise/:idex', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.allQuestion);
router.get('/:id/exercise/:idex/fileExam', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.reviewPDF);
router.get('/:id/exercise/:idex/addQuestion', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.addQuestion);
router.post('/:id/exercise/:idex/addQuestion', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.postNumberQuestion);
router.post('/:id/exercise/:idex/postCreateQuestion', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.postCreateQuestion);
router.post('/:id/exercise/:idex/publish', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.publishEx);

// router student
router.get('/:id/student', overviewActive.localsActive, controller.studentClass);

module.exports = router;