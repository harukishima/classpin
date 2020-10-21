const User = require('../models/users.model');
const mongoose = require('mongoose');   

module.exports.index = (req, res) => {
  res.render('auth/register', {});
};

module.exports.postSignup = async (req, res) => {
  console.log(req.body);
  var namelogin = req.body.namelogin;
  var fullname = req.body.fullname;
  var password = req.body.password1;
  var phone = req.body.phone;
  var retypePassword = req.body.password2;
  var email = req.body.email;
  const userExisted = await User.findOne({namelogin: namelogin});
  if(userExisted) {
    res.render('auth/register', {
      errors: "Username already exists"
    });
    return;
  }

  if(password !== retypePassword) {
    res.render('auth/register', {
      errors: "Password did'nt match"
    });
    return;
  }

  const newUser = new User({
    _id: mongoose.Types.ObjectId(),
    namelogin: namelogin,
    name: fullname,
    password: password,
    email: email,
    phone: phone,
  });

  newUser.save(function(err) {
    if(err) {
      return handleError(err);
    }
    //save
  });

  res.redirect('/login');
}