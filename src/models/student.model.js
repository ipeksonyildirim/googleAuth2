const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  // FIXME student name has been removed, it'll inherit from user. Check controllers
  // FIXME dateOfAdmission has been removed, user.createdAt will be used instead.
  // FIXME email has been migrated to user.
  // FIXME address has been migrated to user.
  // FIXME contact has been migrated to user.
//TODO add appointment
//TODO lecturer give grades
//TODO staj tercihi, ikinci yabancı dil bilgileri secimi yapma
//dersin sinavlarini don
//assignment, post blog

  id: { type: Number, required: true },
  status: {
    type: String, default: 'aktif', enum: ['aktif', 'pasif', 'mezun'], required: true,
  },
  internship: [{
    code:String, year: Number, term: String, company: String, startDate: Date, endDate: Date,
  }],
  // TODO this has been changed from class to grade. Find controllers and fix
  scholarship: { type: Number, required: true },
  grade: { type: String, required: true, enum: ['1', '2', '3', '4'] },
  term: { type: Number, required: true },
  gpas:[ 
    {
      gpa:Number,
      year:Number,
      term: { type: String, enum: ['guz', 'bahar', 'yaz']},
    }],
  secondForeignLanguage: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' },
  credit: { type: Number},
  assignments: [
    {
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
    },
  ],
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      grade: String,
      year:Number,
      term: { type: String, enum: ['guz', 'bahar', 'yaz']},
      status: { type: String, enum: ['basarili', 'basarisiz','-']}
    },
  ],
  feeInfos: [
    {
      
      year:Number,
      term: { type: String, enum: ['guz', 'bahar', 'yaz']},
      type: String,
      fee: Number,
      collection: Number
    }
  ],
  approvement:{type: Boolean, default:false},
  lecturerApprovement: {type: Boolean, default:false},
  internshipSelection:[{
    rank:Number, company: String,
  }]
});



module.exports = mongoose.model('Student', StudentSchema);
