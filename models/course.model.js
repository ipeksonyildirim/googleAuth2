const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: String,
  name: String,
  credit: Number,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  terms: [String],
  schedule: [{
    day: String,
    time: String,
    location: String,
    zoomId: String,
  }],

});
module.exports = mongoose.model('Course', CourseSchema);
