const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  // name and lastname will be inherited from user.
  // dateOfAdmission will be inherited from user.createdAt
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  status: {
    type: String, default: 'aktif', enum: ['aktif', 'pasif'], required: true,
  },
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    },
  ],
  // TODO add officeHours
  // email will be inherited from user
  // address will be inherited from user
  // contact will be inherited from user
});

module.exports = mongoose.model('Lecturer', LecturerSchema);
