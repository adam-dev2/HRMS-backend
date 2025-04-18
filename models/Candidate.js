const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  fullname: String,
  phonenumber: String,
  experience: Number,
  email: String,
  position: String,
  resume: String, 
  status: {
    type: String,
    enum: ["new", "scheduled","ongoing","selected","rejected"],
    default: "new",
  }
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
