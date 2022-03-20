const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  // FIXME student name has been removed, it'll inherit from user. Check controllers
  // FIXME dateOfAdmission has been removed, user.createdAt will be used instead.
  // FIXME email has been migrated to user.
  // FIXME address has been migrated to user.
  // FIXME contact has been migrated to user.

  id: { type: Number, required: true },
  status: {
    type: String, default: 'aktif', enum: ['aktif', 'pasif', 'mezun'], required: true,
  },
  internship: [{
    year: Number, term: String, company: String, startDate: Date, endDate: Date,
  }],
  // TODO this has been changed from class to grade. Find controllers and fix
  scholarship: { type: Number, required: true },
  grade: { type: String, required: true, enum: ['1', '2', '3', '4'] },
  term: { type: Number, required: true },
  gpa: { type: Number, required: true },
  secondForeignLanguage: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' },
  credit: { type: Number, required: true },
});

module.exports = mongoose.model('Student', StudentSchema);
