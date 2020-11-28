module.exports.localsActive = (req, res, next) => {
  res.locals.Active = 'notify';
  next();
}