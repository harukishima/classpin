module.exports.logout = (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
}