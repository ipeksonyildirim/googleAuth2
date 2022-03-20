const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  file: { type: String },
  description: { type: String },
  dueDate: { type: Date, required: true },
});

module.exports = mongoose.model('Assignment', assignmentSchema);