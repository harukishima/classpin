const express = require('express');
const router = express.Router();

const controller = require('../controller/signup.controller');

router.get('/', controller.index );

router.post('/', controller.postSignup);

module.exports = router;