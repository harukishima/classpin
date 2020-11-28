const User = require('../models/users.model');

module.exports.localsUser = async (req, res, next) => {
  if(req.signedCookies.userId) {
    const user = await User.findById({_id: req.signedCookies.userId});
    if(user) {
      res.locals.user = user;
    }
  }
  next();
}