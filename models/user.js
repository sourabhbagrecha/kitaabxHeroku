const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    first: {
      type: String,
      required: true 
    },
    last: { 
      type: String,
      required: true 
    }
  },
  isPublisher: {
    type : Boolean,
    default: false
  },
  createdMaterials: {
    type: [{type : Schema.Types.ObjectId, ref: 'Material'}]
  }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);