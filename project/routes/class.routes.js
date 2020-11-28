const express = require('express');
const router = express.Router();
const controller = require('../controller/class.controller');
const exerciseActive = require('../middleware/exerciseActive.middleware');
const memberActive = require('../middleware/memberActive.middleware');
const notifyActive = require('../middleware/notifyActive.middleware');
const documentActive = require('../middleware/documentActive.middleware');

router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/enroll', controller.enroll);
router.post('/create', controller.postCreate);
router.get('/search', controller.search);
router.get('/:id', controller.classControl);
router.post('/enroll', controller.postEnrollClass);
router.get('/delete/:id', controller.getDelete);
router.post('/delete/:id', controller.postDelete);
router.get('/:id/members', memberActive.localsActive, controller.allMembers);
router.get('/:id/exercise', exerciseActive.localsActive, controller.exercise);
router.get('/:id/exercise/create', exerciseActive.localsActive, controller.createExercise);
router.post('/:id/exercise/create', exerciseActive.localsActive, controller.postCreateEx);

module.exports = router;