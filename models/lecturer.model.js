const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  // name and lastname will be inherited from user.
  // dateOfAdmission will be inherited from user.createdAt
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'aktif',
    enum: ['aktif', 'pasif'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // address will be inherited from user
  // contact will be inherited from user
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
});

module.exports = mongoose.model('Lecturer', LecturerSchema);
