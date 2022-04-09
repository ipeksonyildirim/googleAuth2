const express = require('express')
const router = express.Router()
var faker = require('faker');
const moment = require('moment');
const { validationResult } = require('express-validator');


const Lecturer = require('../models/lecturer.model');
const Department= require('../models/department.model');
const User = require('../models/user.model');
const HttpError = require('../models/http-error.model');
const Student = require('../models/student.model')
const Course = require('../models/course.model')

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');

// Lecturer Home Route
router.get('/', async (req, res, next) => {

   
    let lecturer;
    try {
        lecturer = await Lecturer.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching personel failed, please try again later.',
          500
        );
        return next(error);
      }

    if (lecturer.length > 0) {
        let pages;
      try {
          pages = await Lecturer.find().countDocuments();

      }  catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500
          );
          return next(error);
        }

        res.json({ 
          lecturer: lecturer,
          pages: pages
        });
    } else {
      res.json({ 
        lecturer: lecturer,
      });
    }
});


// Lecturer Detail's Route
router.get('/id=:id', async (req, res, next) => {
    let lecturer;
    try{
        lecturer = await Lecturer.findOne({
            _id: req.params.id
        });
    }
    catch (err) {
        const error = new HttpError(
          'Lecturer is empty .',
          500
        );
        return next(error);
      }
    if (lecturer) {
      res.json({ 
        lecturer: lecturer,
      });
    } else {
        //req.flash('error_msg', 'No records found...');
    }
});


// Lecturer Dept's Route
router.get('/dept=:dept', async (req, res, next) => {
    let lecturer;
    try{
        lecturer = await Lecturer.find({
            department: req.params.dept
          }).populate('user').select({
            name:1,
            _id: 0
          });
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
    
  
    if (lecturer.length>0){
      res.json({ 
        lecturer: lecturer,
      });
    }
    else
    {
        const error = new HttpError(
          'Could not find lecturer for the provided department id.',
            404
          );
          return next(error);
    }
        
  });

// Add Lecturer Form Route
router.get('/add',  async (req, res, next) => {
    let user;
    let dept;
    try {
        user = await User.find();
        dept = await Department.find();
      } catch (err) {
        const error = new HttpError(
          'User or Department is empty .',
          500
        );
        return next(error);
      }
   
    if (dept.length>0 && user.length>0 ) {
      res.json({ 
        dept: dept,
        user: user
      });
    }
});

// Process Lecturer Form Data And Insert Into Database.
router.post('/add',  async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
        const lecturer = new Lecturer({            
            user: req.body.user,
            department: req.body.department,
            status: req.body.status,
            schoolMail : req.body.schoolMail,
            title: req.body.title
        });

        let result;
        try {
            result = await Lecturer.findOne({
                'user': req.body.user
            });
            
        } catch (err) {
            const error = new HttpError(
              'Something went wrong, could not find a department.',
              500
            );
            return next(error);
          }
       

        if (!result) {
            try {
              console.log(lecturer)
                result = await lecturer.save();

                if (result) {
                    //req.flash('success_msg', 'Information saved successfully.');
                    res.redirect('/lecturer');
                }
            } catch (ex) {
                const error = new HttpError(
                    'Something went wrong.',
                    500
                  );
                  return next(error);
            }
        } else {
                const error = new HttpError(
                    'Lecturer Already Exists.',
                    500
                  );
                  return next(error);
        }
    }
});

// Lecturer Edit Form
router.get('/edit/:id', async (req, res, next) => {
    let lecturer;
    try {
        lecturer = await Lecturer.findOne({
            _id: req.params.id
        });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong.',
            500
          );
          return next(error);
    }
  

    let user;
    let dept;
    try {
        user = await User.find();
        dept = await Department.find();
      } catch (err) {
        const error = new HttpError(
          'User or Department is empty .',
          500
        );
        return next(error);
      }
    if (lecturer && user.length>0 && dept.length>0 ) {
      res.json({
        lecturer: lecturer,
        dept: dept,
        user: user
      });
    }
});

// Lecturer Update Route
router.put('/edit/:id',  async (req, res, next) => {
    let lecturer;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            lecturer = await Lecturer.update({
                _id: req.params.id
            }, {
                $set: {
                  user: req.body.user,
            department: req.body.department,
            status: req.body.status,
            courses: req.body.courses,   
            schoolMail : req.body.schoolMail,
            title: req.body.titles
            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (lecturer) {
            //req.flash('success_msg', 'Lecturer Details Updated Successfully.');
            res.redirect('/lecturer');
        }
    }
});

//Lecturer delete route
router.delete('/:id', async (req, res, next) => {
    let result;
    try {
        result = await Lecturer.remove({
            _id: req.params.id
        });
      } catch (err) {
        const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
      }
    

    if (result) {
        //req.flash('success_msg', 'Record deleted successfully.');
        res.redirect('/lecturer');
    } else {
        res.status(500).send();
    }
});


// Lecturer Faker
router.get('/faker', async (req, res, next) => {
    
        const lecturer = new Lecturer({
          user: req.user,
          department: '',
          status: 'aktif',
          courses: ''  
          
      });

      let result;
        try {
        result = await lecturer.save();

        if (result) {
            //req.flash('success_msg', 'Information saved successfully.');
            res.redirect('/lecturer');
        }
    } catch (ex) {
        const error = new HttpError(
            'Something went wrong.',
            500
          );
          return next(error);
    }

  });

//Ders onayi
router.post('/giveApprove/lid=:lid/sid=:sid',  async (req, res, next) => {
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
          {_id: req.params.sid,
            advisor: req.params.lid} ,
           { $set: { 
            lecturerApprovement: true
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

//Lecturer dersler
router.get('/getCourses/id=:id', async (req, res, next) => {
  let lecturer;
  try {
    lecturer = await Lecturer.findOne({
      _id: req.params.id,
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a lecturer.',
      500,
    );
    return next(error);
  }

  if (lecturer) {
    
      let courses = [];
      let course;
      
      for(const courseId of lecturer.courses){
        console.log(courseId.course);
        try {
          course = await Course.findOne({
            _id: courseId.course,
          })} catch (err) {
            const error = new HttpError(
              'Something went wrong, could not find a course.',
              500,
            );
            return next(error);
          }
          console.log(course)
          courses.push(course);
        }
    
      res.json({
        courses:courses,
      });
  } else {
    const error = new HttpError(
      'Could not find lecturer for the provided id.',
      404,
    );
    return next(error);
  }
});

//Lecturer dersler
router.post('/getGrades/id=:id/cid=:cid/sid=:sid', async (req, res, next) => {
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

      }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
      }
    
      if (course){
        try{
          console.log(req.body.grade)

          var statusVar;
          statusVar= 'basarili'

          if(req.body.grade === 0)
            statusVar = 'basarisiz'
          console.log(statusVar)

          student =  await Student.updateOne(
            {_id: req.params.sid ,
            "courses.course": req.params.cid},
            {'$set': {
                          'courses.$.grade': req.body.grade,
                          'courses.$.status': statusVar
              }
         });
        
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
        res.redirect('/student/id='+req.params.sid);

      }
  }
});


module.exports = router;