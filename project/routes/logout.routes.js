const express = require('express');

const router = express.Router();

const controller = require('../controller/logout.controller');

router.get('/', controller.logout);

module.exports = router;