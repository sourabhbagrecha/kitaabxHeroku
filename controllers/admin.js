const Material = require('../models/material');

exports.getDashboard = (req, res, next) => {
  Material.find({isVerified: false})
  .populate({path: 'subject', select: 'title shortForm'})
    .then(notVMaterials => {
      return res.render('admin/dashboard',{
        user: req.user,
        isLoggedIn: req.session.isLoggedIn,
        title: 'Publisher Dashboard | KitaabX',
        notVMaterials: notVMaterials,
        path: '/admin/dashboard'
      })
    })
    .catch( err => console.log(err));
};

exports.getManageMaterial = (req, res, next) => {
  Material.findById(req.params.id)
    .populate([{path: 'subject', select: 'title'},{path: 'publisher', select: 'name email'}])
    .then(material => {
      return res.render('admin/manage-material',{
        user: req.user,
        isLoggedIn: req.session.isLoggedIn,
        title: 'Publisher Dashboard | KitaabX',
        material: material,
        path: '/admin/manage-material'        
      })
    })
    .catch( err => console.log(err));
}

exports.postManageMaterial = (req, res, next) => {
  Material.findById(req.params.id)
    .then(material => {
      material.resourceUrl = req.body.resourceUrl;
      material.totalPages = req.body.totalPages;
      material.isVerified = true;
      material.verificationLevel = 2;
      return material.save();
    })
    .then(results => {
      return res.redirect('/admin/dashboard');
    })
    .catch(err => console.log(err));
}