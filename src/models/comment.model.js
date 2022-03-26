const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
    content: {
        type: String,
        required: [true, "Please enter the comment's content"],
      },
      post: {type: mongoose.Schema.ObjectId, ref: "Post", required: true },
      createdAt: { type: Date, default: Date.now, required: true },
      createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      id: { type: Number,required: true },


});
module.exports = mongoose.model('Comment', commentSchema);