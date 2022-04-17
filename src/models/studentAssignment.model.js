const mongoose = require('mongoose');

const studentAssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true},
  title: { type: String },
  fileName: { type: String },
  filePath: { type:String },
  fileType: { type: String },
  fileSize: { type: String },
  uploadedDate: { type: Date },
  lateSubmission: { type: Boolean },
  isExam: { type:Boolean, default:false}


});

module.exports = mongoose.model('StudentAssignment', studentAssignmentSchema);
