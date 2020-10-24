const express = require('express');
const router = express.Router();

const controller = require('../controller/class.controller');
router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/enroll', controller.enroll);

module.exports = router;