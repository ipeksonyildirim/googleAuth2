const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  credit: { type: Number, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  terms: [{ type: String, required: true }],
  schedule: [{
    day: Number,
    time: String,
    location: String,
    zoomId: String,
  }],
  assignments: [
    {
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    },
  ],
  lecturerNotes: [
    {
      resouce: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    }
  ],
  lecturerVideos: [
    {
      resouce: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    }
  ],
  exams: [
    {
      resouce: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    }
  ],
  otherResources: [
    {
      resouce: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
    }
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' },
  finalExam:{
    date:Date,
    endTime:String,
    startTime: String,
    location:String
  },
  midterm:{
    date:Date,
    endTime:String,
    startTime: String,
    location:String
  },
  makeUpExam:{
    date:Date,
    endTime:String,
    startTime: String,
    location:String
  },
  posts : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
 
});
module.exports = mongoose.model('Course', CourseSchema);

