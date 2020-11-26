const express = require('express');
const router = express.Router();
const controller = require('../controller/class.controller');


router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/enroll', controller.enroll);
router.post('/create', controller.postCreate);
router.get('/search', controller.search);
router.get('/:id', controller.classControl);
router.post('/enroll', controller.postEnrollClass);
router.get('/delete/:id', controller.getDelete);
router.post('/delete/:id', controller.postDelete);
router.get('/:id/members', controller.allMembers);
router.get('/:id/exercise', controller.exercise);
router.get('/:id/exercise/create', controller.createExercise);
router.post('/:id/exercise/create', controller.postCreateEx);

module.exports = router;