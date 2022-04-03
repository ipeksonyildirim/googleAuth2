const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');

const Student = require('../models/student.model');
const Course = require('../models/course.model');

const Department = require('../models/department.model');
const User = require('../models/user.model');
const Lecturer = require('../models/lecturer.model');
const HttpError = require('../models/http-error.model');

const {
  ensureAuthenticated,
  isAdmin,
  createAccessControl,
  readAccessControl,
  updateAccessControl,
  deleteAccessControl,
} = require('../middleware/auth');

// Students Home Route
router.get('/',  async (req, res, next) => {
  let student;
  try {
    student = await Student.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500,
    );
    return next(error);
  }

  if (student.length > 0) {
    let pages;
    try {
      pages = await Student.find().countDocuments();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a student.',
        500,
      );
      return next(error);
    }
    res.json({
      student,
      pages,
    });
  } else {
    res.redirect('/student/add');
  }
});

// Search Student Route.//admin
router.post('/',  async (req, res, next) => {
  const key = req.body.searchInput;
  let student;
  try {
    student = await Student.find({
      id: key,
    });
  } catch (err) {
    const error = new HttpError(
      'User, Department or  Lecturer is empty .',
      500,
    );
    return next(error);
  }

  if (student.length > 0) {
    res.json({
      student: student,
    });
  } else {
    //req.flash('error_msg', 'Record not found.');
    res.redirect('/student');
  }
});

// Student Dept's Route
router.get('/dept=:dept', async (req, res, next) => {
  let student;
  try {
    student = await Student.find({
      department: req.params.dept,
    }).populate('user').select({
      name: 1,
      _id: 0,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }

  if (student) {
    res.json({
      student,
    });
  } else {
    const error = new HttpError(
      'Could not find student for the provided department id.',
      404,
    );
    return next(error);
  }
});

// Student Id's Route
router.get('/id=:id', async (req, res, next) => {
  let student;
  console.log(req.params.id)
  try {
    student = await Student.find({
      _id: req.params.id,
    }).populate('user')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a student.',
      500,
    );
    return next(error);
  }

  if (student) {
    res.json({
      student,
    });
  } else {
    const error = new HttpError(
      'Could not find student for the provided department id.',
      404,
    );
    return next(error);
  }
});


// Add Student Form Route
router.get('/add', async (req, res, next) => {
  let user;
  let lecturer;
  let dept;
  try {
    user = await User.find();
    dept = await Department.find();
    lecturer = await Lecturer.find();
  } catch (err) {
    const error = new HttpError(
      'User, Department or  Lecturer is empty .',
      500,
    );
    return next(error);
  }

  if (dept && user && lecturer) {
    res.json({
      user: user,
      dept: dept,
      advisor: lecturer,
    });
  }
});

// Process Students Form Data And Insert Into Database.
router.post('/add',  async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const student = new Student({
    id: req.body.id,
    status: req.body.status,
    internship: {
      year: req.body.year,
      term: req.body.term,
      companyName: req.body.companyName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
    scholarship: req.body.scholarship,
    grade: req.body.grade,
    term: req.body.term,
    gpa: req.body.gpa,
    secondForeignLanguage: req.body.secondForeignLanguage,
    department: req.body.department,
    user: req.body.user,
    advisor: req.body.advisors,
    credit: req.body.credit,
    assignments:{assignment: req.body.assignments},
    courses: {
      course: req.body.course,
      grade: req.body.grade,
      year:req.body.year,
      term: req.body.term
    }


  });
  let result;
  try {
    result = await Student.findOne({
      id: req.body.id,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong.',
      500,
    );
    return next(error);
  }

  if (!result) {
    try {
      result = await student.save();

      if (result) {
        //req.flash('success_msg', 'Information saved successfully.');
        res.redirect('/student');
      }
    } catch (ex) {
      const error = new HttpError(
        'Something went wrong.',
        500,
      );
      return next(error);
    }
  } else {
    const error = new HttpError(
      'StudentId Already Exists.',
      500,
    );
    return next(error);
  }
});

// Student Edit Form
router.get('/edit/:id',  async (req, res, next) => {
  let student;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong.',
      500,
    );
    return next(error);
  }

  let user;
  let dept;
  let lecturer;
  try {
    user = await User.find();
    dept = await Department.find();
    lecturer = await Lecturer.find();
  } catch (err) {
    const error = new HttpError(
      'User, Department or  Lecturer is empty .',
      500,
    );
    return next(error);
  }
  if (student && user && dept && lecturer) {
    res.json({
      student: student,
      user: user,
      dept: dept,
      advisor: lecturer,
    });
  }
});

// Student Update Route
router.put('/edit/:id',  async (req, res, next) => {
  let student;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  try {
    student = await Student.update({
      _id: req.params.id,
    }, {
      $set: {
        id: req.body.id,
        status: req.body.status,
        internship: {
          year: req.body.year,
          term: req.body.term,
          companyName: req.body.companyName,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        },
        scholarship: req.body.scholarship,
        grade: req.body.grade,
        term: req.body.term,
        gpa: req.body.gpa,
        secondForeignLanguage: req.body.secondForeignLanguage,
        department: req.body.department,
        user: req.body.user,
        advisor: req.body.advisors,
        credit: req.body.credit,
        assignments: req.body.assignments,
        courses: req.body.courses,

      },
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500,
    );
    return next(error);
  }

  if (student) {
    //req.flash('success_msg', 'Student Details Updated Successfully.');
    res.redirect('/student');
  }
});

// Student Delete Route
router.delete('/:id',  async (req, res, next) => {
  let result;
  try {
    result = await Student.remove({
      _id: req.params.id,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong.',
      500,
    );
    return next(error);
  }

  if (result) {
    //req.flash('success_msg', 'Record deleted successfully.');
    res.redirect('/student');
  } else {
    res.status(500).send();
  }
});

// Faker
// eslint-disable-next-line consistent-return
router.get('/faker', async (req, res, next) => {
  let dept;
  try {
    dept = await Department.findOne({
      _id: '623a1e98a197e527ec9f47cc',
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500,
    );
    return next(error);
  }
  const student = new Student({
    id: 123456,
    status: 'aktif',
    internship: {
      year: 2019,
      term: 'Guz',
      companyName: 'XYZ A.Ş.',
      startDate: '2019-12-05',
      endDate: '2019-03-08',
    },
    scholarship: 75,
    grade: '3',
    term: 6,
    gpa: 3.5,
    secondForeignLanguage: 'Almanca',
    department: dept,
    user: req.user,
    advisor: null,
    credit: 42,
    assignments: [],
    courses: [],

  });

  let result;
  try {
    console.log(req.user);
    result = await student.save();

    if (result) {
      // //req.flash('success_msg', 'Information saved successfully.');
      res.redirect('/student');
    }
  } catch (ex) {
    console.log(ex);
    const error = new HttpError(
      'Something went wrong.',
      500,
    );
    return next(error);
  }
});

//Add course - ders secimi
router.post('/addCourse/sid=:sid/cid=:cid',  async (req, res, next) => {
    
  let student;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    else {
      let course;
      try{
        course = await Course.findOne({
            _id: req.params.cid
        });
        student = await Student.findOne({
          _id: req.params.sid
      });
      }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
      }
    
      if (course && student){
        try{
          let course1, student1;
          var dateObj = new Date();
          var month = dateObj.getUTCMonth() + 1;
          let term1;
          if(month<=4)
            term1 = "bahar"
          else if(month<=8)
            term1 = "yaz"
          else
            term1 = "guz"
          course1 =  await Course.updateOne(
            {_id: req.params.cid} ,
             { $push: { students: student } ,
         });
         var courseVar ={
          "course": course,
          "grade": '-',
          "year":dateObj.getUTCFullYear(),
          "term": term1,
          "status":'-'
      };

      console.log(courseVar)

          student1 =  await Student.updateOne(
            {_id: req.params.sid} ,
            {$push: { courses: courseVar } ,
          });
         console.log(student)
        
         
         
        }catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
        }  
      }
      else
      {
        const error = new HttpError(
            'Could not find a course for the provided id.',
            404
          );
          return next(error);
      } 
          
     
      if (student) {
        var id= req.params.sid
        console.log(id)
        res.redirect('/student/id='+student._id);

      }
  }
});

//Ders onayi
router.post('/giveApprove/sid=:sid',  async (req, res, next) => {
  let student;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    else {
      try{
        student =  await Student.updateOne(
          {_id: req.params.sid} ,
           { $set: { 
              approvement: true
            }
       });
       
      }catch (err) {
          const error = new HttpError(
            'Something went wrong .',
            500
          );
          return next(error);
      }
      if (student) {
        res.redirect('/student/id='+req.params.sid);
      }
  }
});

// Student gpa's Route
router.get('/getGpa/id=:id', async (req, res, next) => {
  let student;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }

  if (student) {
    let gpa = 0.0;
    for (const course of student.courses) {
      console.log(course.status);
      if(course.status === 'basarili'){
        gpa = gpa + course.course.credit*course.grade;
      }
    }
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    let term1;
    if(month<=4)
      term1 = "bahar"
    else if(month<=8)
      term1 = "yaz"
    else
      term1 = "guz"
    student =  await Student.updateOne(
      {_id: req.params.sid} ,
      { $push: { gpas: {
                  "gpa": gpa,
                  "year": dateObj.getUTCFullYear(),
                  "term": term1 
                }
              }
      });
      let gpas = student.gpas;
    res.json({
      gpas:gpas
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student dersler
router.get('/getCourses/id=:id', async (req, res, next) => {
  let student;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }

  if (student) {
    
      let courses = student.courses;
    res.json({
      courses:courses
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student yaklasan dersler
router.get('/getIncomingCourses/id=:id', async (req, res, next) => {
  let student;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }

  if (student) {
    //let courses = student.courses;
    var dateObj = new Date();
    var day = dateObj.getUTCDay(); // 0 - sunday 6 -saturday
    var incomingCourses = [];
    var course;
    for (const courses of student.courses) {
      try {
        course = await Course.findOne({
          _id: courses.course,
        })
      } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not find a department.',
          500,
        );
        return next(error);
      }
      if(course){
        console.log(course.schedule)
        for (const schedule of course.schedule) {
          if(schedule.day === day || schedule.day === day+1){
            incomingCourses.push(course);
            break;
          }
        }
      }
      
      }
    res.json({
      courses:incomingCourses
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student ikinci yabanci dil
router.get('/getSFLanguage/id=:id', async (req, res, next) => {

  let student;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }
  if (student) {
    let sfLanguage;
    let totalPages;
    let almPages;
    let arapPages;
    let cinPages;
    let frPages;
    let ispPages;
    let itlPages;
    let japPages;
    let rusPages;
    try {
      totalPages = await Student.find().countDocuments();
      almPages = await Student.countDocuments({secondForeignLanguage: 'Almanca'})
      arapPages = await Student.countDocuments({secondForeignLanguage: 'Arapça'})
      cinPages = await Student.countDocuments({secondForeignLanguage: 'Çince'})
      frPages = await Student.countDocuments({secondForeignLanguage: 'Fransızca'})
      ispPages = await Student.countDocuments({secondForeignLanguage: 'İspanyolca'})
      itlPages = await Student.countDocuments({secondForeignLanguage: 'İtalyanca'})
      japPages = await Student.countDocuments({secondForeignLanguage: 'Japonca'})
      rusPages = await Student.countDocuments({secondForeignLanguage: 'Rusça'})

      sfLanguage = student.secondForeignLanguage;



    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a student.',
        500,
      );
      return next(error);
    }
      
    res.json({
      total:totalPages,
      alm: almPages,
      arap: arapPages,
      cin: cinPages,
      fr: frPages,
      isp: ispPages,
      itl: itlPages,
      jap: japPages,
      rus: rusPages,
      sfLanguage: sfLanguage

    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student ikinci yabanci dil secimi - diller
router.get('/setSFLanguage/sid=:sid',  async (req, res, next) => {
  let languages = [];

  languages.push('Almanca')
  languages.push('Çince')
  languages.push('Fransızca')
  languages.push('İspanyolca')
  languages.push('İtalyanca')
  languages.push('Japonca')
  languages.push('Rusça')
  res.json({
    languages: languages

  });


});

//Student ikinci yabanci dil secimi
router.post('/setSFLanguage/sid=:sid',  async (req, res, next) => {
  
  let student;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    else {
      try{
        student =  await Student.updateOne(
          {_id: req.params.sid} ,
           { $set: { 
              secondForeignLanguage: req.body.secondForeignLanguage
            }
       });
       
      }catch (err) {
          const error = new HttpError(
            'Something went wrong .',
            500
          );
          return next(error);
      }
      if (student) {
        res.redirect('/student/id='+req.params.sid);
      }
  }
});

//Student ortak egitim
router.get('/getInternship/id=:id', async (req, res, next) => {

  let student;
  let internship;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a student.',
      500,
    );
    return next(error);
  }
  if (student) {
    

      internship = student.internships;
      
    res.json({
    
      internship: internship

    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student ortak egitim
router.get('/getInternshipSelection/id=:id', async (req, res, next) => {

  let student;
  let internship;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find internship .',
      500,
    );
    return next(error);
  }
  if (student) {
    

      internship = student.internshipSelection;
      
    res.json({
    
      internship: internship

    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student ortak egitim
router.get('/setInternshipSelection/id=:id', async (req, res, next) => {

  let student;
  let internfirms;
  try {
    student = await Student.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find internship .',
      500,
    );
    return next(error);
  }
  if (student) {
      internfirms = student.department.internFirm;
      
    res.json({
    
      internfirms: internfirms

    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});
//Student ortak egitim
router.post('/setInternshipSelection/id=:id', async (req, res, next) => {

  let student;
  let internfirms;
  try {
    student =  await Student.updateOne(
      {_id: req.params.id} ,
       { $set: { internshipSelection: {
                    "rank": req.body.rank,
                    "company": req.body.company
        }
     }
   });

  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find internship .',
      500,
    );
    return next(error);
  }
  if (student) {
    res.redirect('/student/getInternshipSelection/id='+req.params.id);
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student iletisim
router.get('/getAddress/id=:id', async (req, res, next) => {

  let student;
  let address;
    try{
        student = await Student.findOne({
            _id: req.params.id
          }).populate('user').select({
            address:1,
            _id: 0
          });
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
  if (student) {
    console.log(student.user.address)
    address = student.user.address;
      
    res.json({
      addresses: address
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student odeme
router.get('/getFeeInfo/id=:id', async (req, res, next) => {

  let student;
  let feeInfos;
    try{
        student = await Student.find({
            _id: req.params.id
          })
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
  if (student) {
    feeInfos = student.feeInfos;
      
    res.json({
      feeInfo: feeInfos
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student iletisim
router.get('/getExamInfo/id=:id', async (req, res, next) => {

  let student;
  let finalExam = [];
  let midterm = [];
  let makeUpExam = [];
    try{
        student = await Student.findOne({
            _id: req.params.id
          })
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
  if (student) {
    console.log(student.courses)
    let course;
    for (const courses of student.courses) {
      try {
        course = await Course.findOne({
          _id: courses.course,
        })
      } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not find a course.',
          500,
        );
        return next(error);
      }
      if(course){
        finalExam.push(course.finalExam);
        midterm.push(course.midterm);
        makeUpExam.push(course.makeUpExam);
        break;
          }
        }
      
    res.json({
      midterm: midterm,
      finalExam: finalExam,
      makeUpExam: makeUpExam
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});



module.exports = router;
