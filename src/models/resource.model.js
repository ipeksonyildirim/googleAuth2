const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String },
  description: { type: String },
  fileName: { type: String },
  filePath: { type:String },
  fileType: { type: String },
  fileSize: { type: String },
  uploadedDate: { type: Date },
  isLectureNotes: { type: Boolean, default:false },
  isLectureVideos: { type: Boolean, default:false },
  isOtherResources: { type: Boolean, default:false },

});

module.exports = mongoose.model('Resource', resourceSchema);
