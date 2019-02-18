const Subject = require('../models/subject');
const Material = require('../models/material');

exports.searchSubject = (req, res, next) => {
  const text = req.query.text;
  Subject.find({"$or": [ {shortForm: {"$regex": new RegExp(text, "i")}} , {title: {"$regex": new RegExp(text, "i")}} ] })
    .limit(7)
    .then(results => {
      return res.json(results);
    })
    .catch(err => console.log(err));
}

exports.getSubjects = (req, res, next) => {
  console.log("year:",req.query.year , "branch: ",req.query.branch);
  Subject.find({year: req.query.year , branch: req.query.branch },'title')
    .then(subjects => {
      return res.json(subjects);
    })
    .catch(err => console.log(err));
}

exports.getMaterials = (req, res, next) => {
  console.log("title:"+ req.body.title);
  const materials = [];
  Subject.find({title: req.body.title, "$or": [{ year: { "$ne": req.body.year } },{ branch: { "$ne": req.body.branch }},]})
    .then(subjects => {
      subjects.forEach(subject => {
        materials.push(...subject.materials);
      })
      return materials;
    })
    .then(materialIds => {
      return Material.find({'_id': { $in: [...materialIds]}})
      .populate({path: 'publisher', select:'name'})
        .then(materialsFound => {
          return res.json(materialsFound);
        })
    })
    .catch(err => res.json(err));
}

