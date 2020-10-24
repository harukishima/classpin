const express = require('express');
const router = express.Router();
const controller = require('../controller/class.controller');


router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/enroll', controller.enroll);
router.post('/create', controller.postCreate);
router.get('/search', controller.search);
router.get('/:id', controller.classControl);

module.exports = router;