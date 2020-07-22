const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  dob: Date,
  phoneNumber: String,
  email: String,
  address: Object,
  alert: String,
  notes: [Object],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Client = mongoose.model("client", ClientSchema);