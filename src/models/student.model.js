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

//TODO post comment appointment mocks
//TODO assignment routes ayarla
  schoolMail : String,
  id: { type: Number, required: true },
  status: {
    type: String, default: 'aktif', enum: ['aktif', 'pasif', 'mezun'], required: true,
  },
  internships: [{
    code:String, year: Number, term: String, companyName: String, startDate: Date, endDate: Date, grade: String
  }],
  // TODO this has been changed from class to grade. Find controllers and fix
  scholarship: { type: Number, required: true },
  grade: { type: String, required: true, enum: ['1', '2', '3', '4'] },
  term: { type: Number, required: true },
  gpas:[ 
    {
      value:Number,
      year:Number,
      term: { type: String, enum: ['guz', 'bahar', 'yaz']},
    }],
  gpa: Number,
  secondForeignLanguage: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer' },
  credit: { type: Number},
  assignments: [
    {
      assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentAssignment'},
    },
  ],
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      grade: String,
      year:Number,
      term: { type: String, enum: ['guz', 'bahar', 'yaz']},
      status: { type: String, enum: ['basarili', 'basarisiz','-']},
      courseType:{
        type: String, default: 'zorunlu', enum: ['zorunlu', 'secmeli', 'iyd1', 'iyd2', 'iyd3', 'iyd4'],
      },
    },
  ],
  payments: [
    {
      
      year:Number,
      term: { type: String, enum: ['guz', 'bahar', 'yaz']},
      paymentType: String,
      fee: Number,
      collection: Number
    }
  ],
  approvement:{type: Boolean, default:false},
  lecturerApprovement: {type: Boolean, default:false},
  internshipSelection:[{
    rank:Number, company: String,
  }],
  enrollmentDate: Date,
  creditsTaken:  {type: Number, default:0},
  terms: [
    {
      name: String,
      courses: [
        {
          code: String,
          name: String,
          courseType: String,
          grade: String
        },
      ]
    }],
    lecturerAppointments:[
      {
      code: String,
      teacherName :String,
      appointments: [
        {
          date: { type: Date, required: true },
          hours: String,
      }]
    }
    ],
    advisorAppointments:[
      {
      teacherName :String,
      appointments: [
        {
          date: { type: Date, required: true },
          hours: String,
      }]
    }
    ],
    studentAffairsAppointments:[
      {
      personnelName :String,
      appointments: [
        {
          date: { type: Date, required: true },
          hours: String,
      }]
    }
    ],
    ITAppointments:[
      {
        date: { type: Date, required: true },
        hours: String,
    }
  
    ]
});



module.exports = mongoose.model('Student', StudentSchema);
