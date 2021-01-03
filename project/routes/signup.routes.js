const express = require('express');
const router = express.Router();

const controller = require('../controller/signup.controller');

router.get('/', controller.index );

router.post('/', controller.postSignup);

router.get('/is-available', controller.isAvailable);

module.exports = router;