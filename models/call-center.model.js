const mongoose = require('mongoose');

const CallCenterSchema = new mongoose.Schema({
  name: {
    type: String
  },
  about: {
    type: String
  },
  img: {
    type: String
  },
  users: [{
      id: String,
      isAdmin: Boolean
  }],
  callScripts: [{
    title: String,
    updated: Date,
    updatedBy: String,
    created: Date,
    createdBy: String,
    questions: mongoose.Schema.Types.Mixed
  }],
  creator: {
    type: String
  },
  clients: [String],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = CallCenter = mongoose.model('callCenter', CallCenterSchema);