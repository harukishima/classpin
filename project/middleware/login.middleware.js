const User = require('../models/users.model');

module.exports.authRequire = async (req, res, next)=> {
  if(!req.signedCookies.userId) {
    res.redirect('/login');
    return;
  }
  const user = await User.findById({_id: req.signedCookies.userId});
  if(!user) {
    res.redirect('/login');
    return;
  }
  res.locals.user = user;
  req.session.userId = user._id.toString();
  next();
}