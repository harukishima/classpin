const express = require('express');
const router = express.Router();
const controller = require('../controller/user.controller');
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

router.get('/:id', controller.profile);
router.get('/updateprofile/:id', controller.updateProfile);
router.post('/updateprofile/:id', upload.single('avatar'), controller.postUpdateProfile);

module.exports = router;