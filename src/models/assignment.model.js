const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  file: { type: String },
  fileExtension: { type:String, required: true },
  directory: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
