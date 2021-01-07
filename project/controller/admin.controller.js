const User = require('../models/users.model');

module.exports.listUser = (req, res) => {
  User.find({}).then(function (users) {
    res.render('users/index', {
      users: users
    });
  });
}

module.exports.index = (req, res) => {
  res.render('admin/index');
}



