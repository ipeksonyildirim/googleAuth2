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
    schoolMail: req.body.schoolMail,
    id: req.body.id,
    status: req.body.status,
    scholarship: req.body.scholarship,
    grade: req.body.grade,
    term: req.body.term,
    gpa: req.body.gpa,
    secondForeignLanguage: req.body.secondForeignLanguage,
    department: req.body.department,
    user: req.body.user,
    advisor: req.body.advisor,
    credit: req.body.credit,
    payments:
      {
        
        year:req.body.year,
        term: req.body.term,
        paymentType: req.body.paymentType,
        fee: req.body.fee,
        collection: req.body.collection
      },

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
        schoolMail: req.body.schoolMail,
        id: req.body.id,
        status: req.body.status,
        internships: {
          code: req.body.code,
          year: req.body.year,
          term: req.body.term,
          companyName: req.body.companyName,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          grade: req.body.grade,
        },
        scholarship: req.body.scholarship,
        grade: req.body.grade,
        term: req.body.term,
        gpas:[ 
          {
            gpa:req.body.gpas,
            year:req.body.year,
            term: req.body.term,
          }],
        gpa: req.body.gpa,
        secondForeignLanguage: req.body.secondForeignLanguage,
        department: req.body.department,
        user: req.body.user,
        advisor: req.body.advisor,
        credit: req.body.credit,
        assignments: req.body.assignments,
        courses: {
          course: req.body.course,
          grade: req.body.grade,
          year:req.body.year,
          term: req.body.term,
          status: req.body.status,
          courseType:req.body. courseType,
        },
        payments:
          {
            
            year:req.body.year,
            term: req.body.term,
            paymentType: req.body.paymentType,
            fee: req.body.fee,
            collection: req.body.collection
          },
        approvement:req.body.approvement,
        lecturerApprovement: req.body.lecturerApprovement,
        internshipSelection:{
          rank:req.body.rank, 
          company: req.body.company,
        },

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
  let advisor;
  let user;
  try {
    dept = await Department.findOne({
      _id: '623bad2c8ff182d672a02351',
    });
    user = await User.findOne({
      _id: '624f4367ec7b69dcc20c8f41',
    });
    advisor = await Lecturer.findOne({
      _id: '624a1fdf0d412bd580ae2927',
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
    scholarship: 75,
    grade: '4',
    term: 9,
    gpa: 3.7,
    secondForeignLanguage: 'Almanca',
    department: dept,
    user: user,
    advisor:advisor,
    credit: 42
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
          let course1, student1, courseType;
          var dateObj = new Date();
          var month = dateObj.getUTCMonth() + 1;
          let term1;
          if(month<=4)
            term1 = "bahar"
          else if(month<=8)
            term1 = "yaz"
          else
            term1 = "guz"
          if(course.code.includes("001") && course.code !== "ING001")
            courseType = 'iyd1'
          else if(course.code.includes("002") && course.code !== "ING002")
            courseType = 'iyd2'
          else if(course.code.includes("003") && course.code !== "ING003")
            courseType = 'iyd3'
          else if(course.code.includes("003") && course.code !== "ING001")
            courseType = 'iyd4'
          course1 =  await Course.updateOne(
            {_id: req.params.cid} ,
             { $push: { students: student } ,
         });
         var courseVar ={
          "course": course,
          "grade": '-',
          "year":dateObj.getUTCFullYear(),
          "term": term1,
          "status":'-',
          "courseType":courseType
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
  let courseSchema;
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
    let i = 0;
    for (const course of student.courses) {
      console.log( course.course);
      courseSchema = await Course.findOne({
        _id: course.course,
      })
      console.log(courseSchema);
      if(course.status === 'basarili' && courseSchema){
        gpa = gpa + courseSchema.credit*course.grade;
      }
      i = i+1;
    }
    if(i > 0){
      gpa = gpa/i;

    }
    console.log(gpa)
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    let term1;
    if(month<=4)
      term1 = "bahar"
    else if(month<=8)
      term1 = "yaz"
    else
      term1 = "guz"
    console.log(term1)
    let student1;
    let gpas = {
      "gpa": gpa,
      "year": dateObj.getUTCFullYear(),
      "term": term1 
    }
    console.log(gpas)

    student1 =  await Student.updateOne(
      {_id: req.params.id} ,
      { $set: { gpas: gpas
              }
      });
     
      console.log(student.gpas)
    res.json({
      gpas:student.gpas
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

//Student donem dersleri
router.get('/getTermCourses/id=:id', async (req, res, next) => {
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
    var month = dateObj.getUTCMonth() + 1;
    let term1;
    if(month<=4)
      term1 = "bahar"
    else if(month<=8)
      term1 = "yaz"
    else
      term1 = "guz"
    let year;
    year = dateObj.getUTCFullYear()
    
    var termCourses = [];
    var course;
    console.log(year, term1)
    for (const courses of student.courses) {

      if(courses.term === term1 && courses.year === year){
        console.log(courses.year, courses.term)
        termCourses.push(courses);
      }
    }
    res.json({
      courses:termCourses
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
/*
"courses": [
      {
          "year": "2019",
          "semester": "Guz",
          "type": "IYD 1",
          "shortCode": "ALM 001",
          "grade": "BB",
          "status": "Basarili"
      },
*/
  let courses = [];
  let course;
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
      var all = [];
      var dept = [];
    
      almPages = await Student.countDocuments({secondForeignLanguage: 'Almanca'})
      feed = {
        name:"Almanca",
        value: almPages
      }
      all.push(feed);

      arapPages = await Student.countDocuments({secondForeignLanguage: 'Arapça'})
      feed = {
        name:"Arapça",
        value: arapPages
      }
      all.push(feed);

      cinPages = await Student.countDocuments({secondForeignLanguage: 'Çince'})
      feed = {
        name:"Çince",
        value: cinPages
      }
      all.push(feed);

      frPages = await Student.countDocuments({secondForeignLanguage: 'Fransızca'})
      feed = {
        name:"Fransızca",
        value: frPages
      }
      all.push(feed);

      ispPages = await Student.countDocuments({secondForeignLanguage: 'İspanyolca'})
      feed = {
        name:"İspanyolca",
        value: ispPages
      }
      all.push(feed);

      itlPages = await Student.countDocuments({secondForeignLanguage: 'İtalyanca'})
      feed = {
        name:"İtalyanca",
        value: itlPages
      }
      all.push(feed);

      japPages = await Student.countDocuments({secondForeignLanguage: 'Japonca'})
      feed = {
        name:"Japonca",
        value: japPages
      }
      all.push(feed);

      rusPages = await Student.countDocuments({secondForeignLanguage: 'Rusça'})
      feed = {
        name:"Rusça",
        value: rusPages
      }
      all.push(feed);


      almPages = await Student.countDocuments({secondForeignLanguage: 'Almanca'}, {department : {$eq: student.department}})
      var feed = {
        name:"Almanca",
        value: almPages
      }
      dept.push(feed);

      arapPages = await Student.countDocuments({secondForeignLanguage: 'Arapça'}, {department : {$eq: student.department}})
      var feed = {
        name:"Arapça",
        value: arapPages
      }
      dept.push(feed);

      cinPages = await Student.countDocuments({secondForeignLanguage: 'Çince'}, {department : {$eq: student.department}})
      var feed = {
        name:"Çince",
        value: cinPages
      }
      dept.push(feed);

      frPages = await Student.countDocuments({secondForeignLanguage: 'Fransızca'}, {department : {$eq: student.department}})
      var feed = {
        name:"Fransızca",
        value: frPages
      }
      dept.push(feed);

      ispPages = await Student.countDocuments({secondForeignLanguage: 'İspanyolca'}, {department : {$eq: student.department}})
      var feed = {
        name:"İspanyolca",
        value: ispPages
      }
      dept.push(feed);
      
      itlPages = await Student.countDocuments({secondForeignLanguage: 'İtalyanca'}, {department : {$eq: student.department}})
      var feed = {
        name:"İtalyanca",
        value: itlPages
      }
      dept.push(feed);

      japPages = await Student.countDocuments({secondForeignLanguage: 'Japonca'}, {department : {$eq: student.department}})
      var feed = {
        name:"Japonca",
        value: japPages
      }
      dept.push(feed);

      rusPages = await Student.countDocuments({secondForeignLanguage: 'Rusça'})
      var feed = {
        name:"Rusça",
        value: rusPages
      }
      dept.push(feed);

    
      
      
      sfLanguage = student.secondForeignLanguage;

      for(const key of student.courses){
        if(key.courseType.includes("iyd")){
          try {
            course = await Course.findOne({
              _id: key.course,
            })
          } catch (err) {
            const error = new HttpError(
              'Something went wrong, could not find a course.',
              500,
            );
            return next(error);
          }
          if(course){
            var feed = {year: key.year, term: key.term, courseType: key.courseType, shortCode: course.code, grade: key.grade, status: key.status};
            courses.push(feed);
          }
        }
          
      }



    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a student.',
        500,
      );
      return next(error);
    }
      
    res.json({
      sfLanguage:sfLanguage,
      all: all,
      dept: dept,
      courses: courses,

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
    
      internships: internship

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
       { $push: { internshipSelection: {
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

//Student address
router.get('/getAddress/id=:id', async (req, res, next) => {

  let student;
  let address = [];
    try{
        student = await Student.findOne({
            _id: req.params.id
          }).populate('user')
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
  if (student) {
    console.log(student.user)
    address = student.user.address;
      
    res.json({
      address: address
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
router.get('/getContact/id=:id', async (req, res, next) => {

  let student;
  let contacts = [];
    try{
        student = await Student.findOne({
            _id: req.params.id
          }).populate('user')
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
  if (student) {
    console.log(student.user)
    contacts = student.user.contact;
      
    res.json({
      contacts: contacts
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
  let payments = [];
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
    console.log(student)
    payments = student.payments;
      
    res.json({
      payments: payments
    });
    
  } else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

//Student add odeme bilgisi
router.post('/addFeeInfo/id=:id', async (req, res, next) => {

  let student;
  let feeInfos = [];
    try{
      student =  await Student.updateOne(
        {_id: req.params.id} ,
         { $push: { payments: {
          "year": req.body.year,
          "term": req.body.term,
          "paymentType": req.body.paymentType,
          "fee": req.body.fee,
          "collection": req.body.collection,
          }
       }
    }
    )}catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a student.',
      500
    );
    return next(error);
  }
  if (student) {
    res.redirect('/student/getFeeInfo/id='+req.params.id);
    
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
        var e1 = {code: course.code, name: course.name, midterm:course.midterm};
        var e2 = {code: course.code, name: course.name, finalExam:course.finalExam};
        var e3 = {code: course.code, name: course.name, makeUpExam:course.makeUpExam};

        finalExam.push(e2);
        midterm.push(e1);
        makeUpExam.push(e3);
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

//Student ders programi
router.get('/getSchedule/id=:id', async (req, res, next) => {

  let student;
  let schedule = [];
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
    //let courses = student.courses;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    let term1;
    if(month<=4)
      term1 = "bahar"
    else if(month<=8)
      term1 = "yaz"
    else
      term1 = "guz"
    let year;
    year = dateObj.getUTCFullYear()
    
    var course;
    console.log(year, term1)
    for (const courses of student.courses) {
      var course;
      if(courses.term === term1 && courses.year === year){
        try {
          course = await Course.findOne({
            _id: courses.course,
          })
        } catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a student.',
            500,
          );
          return next(error);
        }
        if(course){
          var feed = {name: course.code , schedule: course.schedule}
          console.log(feed)
          schedule.push(feed);
        }
        
      }
    }
    res.json({
      schedule:schedule
    });
    
  }  else {
    const error = new HttpError(
      'Could not find student for the provided id.',
      404,
    );
    return next(error);
  }
});

module.exports = router;
