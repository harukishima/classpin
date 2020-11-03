const express = require('express');
const router = express.Router();

const controller = require('../controller/auth.controller');

router.get('/', controller.login);
router.post('/', controller.postlogin);

module.exports = router;