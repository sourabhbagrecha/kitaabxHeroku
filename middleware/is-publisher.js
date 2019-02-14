module.exports = (req, res, next) => {
  if(!req.session.isLoggedIn){
    return res.redirect('/auth/login');
  }
  if(!req.user.isPublisher){
    return res.redirect('/publisher/signup');
  }
  next();
}