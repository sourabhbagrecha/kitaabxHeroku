const express = require("express");
const router = express.Router();

const User = require('../models/user');
const Material = require('../models/material');
const Subject = require('../models/subject');

exports.getSignup = (req, res, next) => {
  res.render('publisher/signup',{
    user: req.user,
    isLoggedIn: req.session.isLoggedIn,
    title: 'Publisher| Signup',
    path: '/publisher/signup'  
  })
}

exports.postSignup = (req, res, next) => {
	User.findById(req.user._id,'isPublisher')
		.then((user) => {
			if(!user.isPublisher){
        user.isPublisher = true;
      }
			return user.save();
		})
		.then((results) => {
			return res.redirect('/');
		})
		.catch(err => console.log(err));
};

exports.getDashboard = (req, res, next) => {
  User.findById(req.user._id,'isPublisher createdMaterials')
    .populate({path: 'createdMaterials', select: 'subject notesType createdAt branch year', populate : {path: 'subject', select: 'title shortForm'}})
    .then(user => {
      console.log(user);
      return res.render('publisher/dashboard',{
        user: req.user,
        isLoggedIn: req.session.isLoggedIn,
        title: 'Publisher| Dashboard',
        createdMaterials: user.createdMaterials,
        path: '/publisher/dashboard'
      })
    })
    .catch(err => {
      console.log(err);
      return res.redirect('/error');
    })
};

exports.getCreateMaterialPage = (req, res, next) => {
  res.render('publisher/createMaterial1',{
    user: req.user,
    isLoggedIn: req.session.isLoggedIn,
    title: 'Create Material',
    path: '/publisher/createMaterial/step1'
  })
}

exports.getStep2 = (req, res, next) => {
  return res.render('publisher/createMaterial2',{
    user: req.user,
    isLoggedIn: req.session.isLoggedIn,
    title: 'Create Material',
    materialId: req.params.id,
    path: '/publisher/createMaterial/step2'
  })
}

exports.postStep1 = (req, res, next) => {
  Material.create({
    subject: req.body.subject,
    branch: req.body.branch,
    year: req.body.year,
    publisher: req.user._id.toString()
  })
  .then(results => {
    const savedResults = results;
    console.log(results)
    User.findById(req.user._id)
      .then(user => {
        user.createdMaterials.push(results._id);
        return user.save();
      })
      .then(() => {
        Subject.findById(savedResults.subject)
          .then(subject => {
            subject.materials.push(savedResults._id);
            return subject.save();
          })
          .catch(err => console.log(err));
      })
      .then(results => {
        return res.redirect(`/publisher/createMaterial/${savedResults._id}/uploadpdf`);
      })
  })
  .catch(err => {
    console.log(err);
    return res.redirect('/error');
  })
}

exports.postStep2 = (req, res, next) => {
  Material.findById(req.body.materialId)
  .then(material => {
    material.pdfUrl = req.body.pdfUrl;
    material.guidedBy = req.body.guidedBy;
    const contentsArray=[];
    req.body.unit.forEach((title, i) => {
      newUnit = {
        chapterNo: i+1,
        chapterName: title,
        start: req.body.start[i]
      }
      contentsArray.push(newUnit);
    })
    material.contents = contentsArray;
    return material.save()
  })
  .then(outputs => {
    console.log(outputs);
    return res.redirect('/publisher/dashboard');
  })

  .catch(err => console.log(err));
}