const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
  title: {
    type: String,
    required: [true, "Please enter the post's title"],
  },
  content: {
    type: String,
    required: [true, "Please enter the post's content"],
  },
  course: {type: mongoose.Schema.ObjectId, ref: "Course", required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  comments: [{
    content: String,
    createdAt: { type: Date, default: Date.now, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  }],
});
  
module.exports = mongoose.model('Post', postSchema);