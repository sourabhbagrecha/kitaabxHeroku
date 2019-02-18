module.exports = (req, res, next) => {
  if(!req.session.isLoggedIn){
    req.flash('error', 'You must login first!')
    return res.redirect('/auth/login');
  }
  next();
}