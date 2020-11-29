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

var upload = multer({ dest: 'public/uploads/pdf/' })

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
router.get('/:id/exercise/:idex', exerciseActive.localsActive, localsClassTeacher.localsClassTeacher, controller.updateExercise);

module.exports = router;