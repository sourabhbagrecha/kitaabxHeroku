const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  shortForm: {
    type: String,
    minlength: 1,
    maxlength: 5
  },
  materials: {
    type: [{type: Schema.Types.ObjectId, ref: 'Material'}]
  }
}, {timestamps: true});

module.exports = mongoose.model('Subject', subjectSchema);