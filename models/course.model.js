const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  credit: { type: Number, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  terms: [{ type: String, required: true }],
  schedule: [{
    day: String,
    time: String,
    location: String,
    zoomId: String,
  }],
  assignments: [
    {
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
      isActive: Boolean,
    },
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  lecturers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' }],
  
});
module.exports = mongoose.model('Course', CourseSchema);
