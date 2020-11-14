const express = require('express');

const router = express.Router();

const controller = require('../controller/guide.controller');

router.get('/', controller.guide);

module.exports = router;