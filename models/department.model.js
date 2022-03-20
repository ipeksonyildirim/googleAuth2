const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  curriculum: [
    [{
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    }, [{
      type: String,
      required: true,
      enum: ['guz', 'bahar', 'yaz'],
    }, [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }]]],

  ],
});

module.exports = mongoose.model('Department', DepartmentSchema);
