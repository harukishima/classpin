const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');   

module.exports.index = (req, res) => {
  res.render('auth/register', {});
};

module.exports.postSignup = async (req, res) => {
  const userExisted = await User.findOne({namelogin: req.body.namelogin});
  if(userExisted) {
    res.render('auth/register', {
      errors: "Username already exists"
    });
    return;
  }

  if(req.body.password1 !== req.body.password2) {
    res.render('auth/register', {
      errors: "Password did'nt match"
    });
    return;
  }

  const hashPassword = await bcrypt.hash(req.body.password1, 10)
  const newUser = new User({
    _id: mongoose.Types.ObjectId(),
    namelogin: req.body.namelogin,
    name: req.body.fullname,
    password: hashPassword,
    email: req.body.email,
    phone: req.body.phone,
  });

  newUser.save(function(err) {
    if(err) {
      return handleError(err);
    }
    //save
  });

  res.redirect('/login');
}