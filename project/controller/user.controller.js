const { Mongoose } = require('mongoose');
const User = require('../models/users.model');

module.exports.updateProfile = (req, res) => {
  res.render('users/updateprofile', {
  });
}

module.exports.postUpdateProfile = async (req, res) => {
  const user = await User.findById({ _id: userId });
  var userId = req.params.id;
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  if (user._id.toString() !== req.signedCookies.userId) {
    throw Error();
  }
  try {
    user.name = name;
    user.phone = phone;
    user.email = email;
    if (req.file) {
      user.avatar = '/' + req.file.path.split("\\").slice(1).join('/');
    }
    await user.save();
    var string = encodeURIComponent("success");
    res.redirect('/users/' + user._id + '/?valid=' + string);
  } catch (err) {
    var string = encodeURIComponent("fail");
    res.redirect('/users/' + user._id + '/?valid=' + string);
  }
}

module.exports.profile = async (req, res) => {
  var passedVariable = req.query.valid;
  const user = await User.findById({ _id: req.params.id });
  var auth = true;
  if (user._id.toString() !== req.signedCookies.userId) {
    auth = false;
  }
  res.render('users/profile', {
    matchedUser: user,
    passedVariable: passedVariable,
    auth: auth,
  });
}





