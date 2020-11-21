const express = require('express');
const controller = require('../controller/admin.controller');
const router = express.Router();


router.get('/', controller.index);
router.get('/users', controller.listUser);

module.exports = router;