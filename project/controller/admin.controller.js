const User = require('../models/users.model');


module.exports.index = (req, res) => {
  res.render('admin/index');
}

module.exports.listUser = (req, res) => {
  User.find({}).then(function (users) {
    res.render('users/index', {
      users: users
    });
  });
}

