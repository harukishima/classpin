const User = require("../models/users.model");
const bcrypt = require('bcrypt');


module.exports.postlogin = async (req, res) => {
  var namelogin = req.body.namelogin;
  var password = req.body.password;
  const user = await User.findOne({ namelogin: namelogin });
  if (!user) {
    res.render('auth/login', {
      errors: [
        'User does not exist'
      ]
    });
    return;
  }

  const isvalid = await bcrypt.compare(password, user.password);

  if (!isvalid) {
    res.render('auth/login', {
      errors: [
        'Wrong password'
      ]
    });
    return;
  }

  res.cookie('userId', user._id, { signed: true });
  res.redirect('/');
}

module.exports.login = (req, res) => {
  if (req.signedCookies.userId) {
    res.redirect('/');
  }
  const status = req.query.status;
  res.render('auth/login', {
    status: status,
  });
}