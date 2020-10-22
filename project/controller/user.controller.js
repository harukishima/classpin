const User = require('../models/users.model');

module.exports.index = (req, res) => {
  User.find({}).then(function(users) {
      res.render('users/index', {
          users: users
      });
  });
}

module.exports.profile =  (req, res) => {
  User.findById({_id: req.params.id}).then(function(user) {
      res.render('users/profile', {
          user: user
      });
  }) ;
}

module.exports.updateProfile = (req, res) => {
  res.render('users/updateprofile', {
    
  });
}

module.exports.postUpdateProfile = async (req, res) => {
  var userId = req.params.id;
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  const user = await User.findById({_id: userId});
  user.name = name;
  user.phone = phone;
  user.email = email;
  user.avatar = '/' + req.file.path.split("\\").slice(1).join('/');  
  await user.save();
  res.redirect('/users/' + user._id);
}