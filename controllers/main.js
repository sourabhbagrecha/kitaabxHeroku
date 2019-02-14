const Subject = require('../models/subject');
const Material = require('../models/material');

exports.getHome = (req, res, next) => {
  return res.render('main/home',{
    title: 'Kitaabx| Welcome',
    isLoggedIn: req.session.isLoggedIn,
    user: req.user,
		errorMessage: req.flash('error'),
		successMessage: req.flash('success')
  });
};

exports.getSubjects = (req, res, next) => {
  Subject.find({year: req.query.year , branch: req.query.branch })
    .then(subjects => {
      return res.render('main/subjects',{
        title: '| KitaabX',
        isLoggedIn: req.session.isLoggedIn,
        user: req.user,
        subjects: subjects,
        query: req.query
      })
    })
    .catch(err => console.log(err));
}

exports.getSubject = (req, res, next) => {
  Subject.findById(req.params.id)
    .populate({path:'materials', select:'publisher branch year guidedBy contents', populate:{path: 'publisher', select:'name'}})
    .then(subject => {
      return res.render('main/subject', {
        title: subject.title + ' | KitaabX',
        isLoggedIn: req.session.isLoggedIn,
        user: req.user,
        subject: subject
      })
    })
    .catch(err => console.log(err));
}

exports.getMaterial = (req, res, next) => {
  console.log(req.params.id);
  Material.findById(req.params.id)
    .populate({path: 'subject', select: 'title year branch'})
    .populate({path: 'publisher', select: 'name'})
    .then(material => {
      console.log(material)
      const title = material.subject.title + ' | KitaabX';
      return res.render('main/material', {
        title: title,
        isLoggedIn: req.session.isLoggedIn,
        user: req.user,
        material: material
      })
    })
    .catch(err => {
      return console.log(err);
    });
}
