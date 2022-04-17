const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String },
  description: { type: String },
  fileName: { type: String },
  filePath: { type:String },
  fileType: { type: String },
  fileSize: { type: String },
  dueDate: { type: Date },
  uploadedDate: { type: Date },
  isExam: { type:Boolean, default:false}

});

module.exports = mongoose.model('Assignment', assignmentSchema);
