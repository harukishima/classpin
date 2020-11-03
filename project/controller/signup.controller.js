const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');   

module.exports.index = (req, res) => {
  res.render('auth/register', {});
};

module.exports.postSignup = async (req, res) => {
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

  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = new User({
    _id: mongoose.Types.ObjectId(),
    namelogin: namelogin,
    name: fullname,
    password: hashPassword,
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