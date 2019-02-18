const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const materialSchema = new Schema({
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  guidedBy: {
    type: String
  },
  publisher:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  year:{
    type: Number,
    min: 1,
    max: 4,
    required: true
  },
  contents:{
    type: [{chapterNo: Number,chapterName: String, start: Number}]
  },
  branch:{
    type: String,
    required: true
  },
  totalPages: {
    type: Number,
    default: 0
  },
  notesType:{
    type: String,
    enum: ['Handwritten','Printed','PPT', 'Question Paper']
  },
  views: {
    type: Number,
    default: 0
  },
  pdfUrl:{
    type: String
  },
  approved:{
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationLevel:{
    type: Number, min: 1, max: 4, default: 1
  },
  resourceUrl: {
    type: String
  }
},{timestamps: true});

module.exports = mongoose.model('Material', materialSchema);