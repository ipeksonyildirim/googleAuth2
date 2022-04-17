const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');

const Student = require('../models/student.model');
const Course = require('../models/course.model');
const Personnel = require('../models/personnel.model');

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
  isOwner,
  inCourse
} = require('../middleware/auth');


// appointment Home Route
router.get('/id=:id', async (req, res, next) => {
    let user;
    try {
      user = await User.findOne({_id: req.params.id});
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500,
      );
      return next(error);
    }
  
    if (user) {
        let availableDates;
        let appointment;
        console.log(user.appointments)
        availableDates = user.availableDates;
        appointment = user.appointments;
      
      res.json({
        availableDates: availableDates,
        appointment: appointment
      });
    } else {
      res.redirect('/student');
    }
  });
  
  // Search Student Route.//admin
  router.post('/id=:id',async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
    else {
      let user;
      try {
        console.log(req.body.date)
        var date ={
          date:req.body.date,
          hour:req.body.hours,
        } 
        user = await User.updateOne(
          {_id: req.params.id} ,
          { $push: { availableDates:date   } ,
        });
      } catch (err) {
        const error = new HttpError(
          'User is empty .',
          500,
        );
        return next(error);
      }
    
      if (user) {
        res.redirect('/appointment/id='+req.params.id);
      } else {
        //req.flash('error_msg', 'Record not found.');
        res.redirect('/student');
      }
    }
  });

// ogrenci isleri appointment
router.get('/courses/id=:id',  async (req, res, next) => {
  
  let department;
  let student;
  let user;
  let course;
  let stuCourses = []
  try {
    user = await User.findOne({_id: req.params.id})
    student = await Student.findOne({user: user})
    
    if(user && student)
    {
      for (const courses of student.courses)
      {
        console.log(courses.course)
        course = await Course.findOne({_id: courses.course});
        var cNames = {
          code: course.code,
          name: course.name,
          _id: course._id
        }
        stuCourses.push(cNames);
      }
      
    }
    
  } catch (err) {
    const error = new HttpError(
      'User is empty .',
      500,
    );
    return next(error);
  }

  res.json({stuCourses: stuCourses})
});

  // Ders appointment Route
  router.post('/lecturer/id=:id/cid=:cid',  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
    else {
      let user;
      let userWith;
      let course;
      let student;
      let lecturer;
      try {
        user = await User.findOne({_id: req.params.id})
        student = await Student.findOne({user: user._id})
        course = await Course.findOne({_id: req.params.cid})
        lecturer = await Lecturer.findOne({_id: course.lecturer._id})
        console.log(lecturer)
        userWith = await User.findOne({_id: lecturer.user._id})
        console.log(userWith)
        if(userWith && user)
        {
          let user1, userWith1, student1;
          let userAvailability = false;
            let userWithAvailability = false;
          for(const key of user.availableDates){
            let date = req.body.date;
            let hours =  req.body.hours;
            console.log(key.date)
            console.log(date)

            if(key.date === date && key.hours === hours){
              userAvailability = true;
            }              
            }

          for(const key of userWith.availableDates){
            let date = req.body.date
            let hours =  req.body.hours;
            console.log(key.date)
            console.log(date)
            if(key.date === date && key.hours === hours){
              userWithAvailability = true;
            }
          }           
          console.log( userAvailability)
          console.log("aa")
          console.log( userWithAvailability)
          if(userAvailability === true && userWithAvailability === true){
            user1 = await User.updateOne(
              {_id: req.params.id} ,
              { $push: { appointments: {
                with: userWith,
                date : req.body.date,
                hours: req.body.hours,
                isActive: true        
              } } ,
            });

          user1 = await User.updateOne(
            {_id: req.params.id} ,
            { $pull: { availableDates: {date : req.body.date,
              hours: req.body.hours }} ,
            });

            userWith1 = await User.updateOne(
              {_id:userWith._id} ,
              { $push: { appointments: {
                with: user,
                date : req.body.date,
                hours: req.body.hours,
                isActive: true        
              } } ,
            });

          userWith1 = await User.updateOne(
            {_id: userWith._id} ,
            { $pull: { availableDates: { date : req.body.date,
              hours: req.body.hours }} ,
            });

            student1 = await Student.updateOne(
              {_id: student,'lecturerAppointments.code': course.code, 'lecturerAppointments.appointmentsWith': lecturer.title},
              {'$push': {
                'lecturerAppointments.$.appointments': {
                date : req.body.date,
                hours: req.body.hours,} 
              }
            })
            if(student1.modifiedCount == 0 ){
              var lecturerAppointments = {
                code: course.code,
                appointmentsWith: lecturer.title,
                appointments: [{
                  date : req.body.date,
                  hours: req.body.hours,
                }]
              }
              student1 =  await Student.updateOne(
                {_id: student}, {'$push': {
                  lecturerAppointments:lecturerAppointments}
              });
             }
          
         }
        }
      
        
      } catch (err) {
        const error = new HttpError(
          'User is empty .',
          500,
        );
        return next(error);
      }
    
      if (user) {
        res.redirect('/appointment/id='+user._id);
      } else {
        //req.flash('error_msg', 'Record not found.');
        res.redirect('/student');
      }
    }
  });


// ogrenci isleri appointment
router.get('/studentAffairs',  async (req, res, next) => {
  
    let department;
    let personnel;
    let user;
    let users = []
    try {
      department = await Department.findOne({name: "Öğrenci İşleri"});
      console.log(department)
      personnel = await Personnel.find({department: department});
      console.log(personnel)
      if(department && personnel)
      {
        console.log(personnel)
        for (const personel1 of personnel)
        {
          user = await User.findOne({_id: personel1.user});
          console.log(user)
          var userNames = {
            name: user.name,
            _id: user._id
          }
          users.push(userNames);
        }
        
      }
      
    } catch (err) {
      const error = new HttpError(
        'User is empty .',
        500,
      );
      return next(error);
    }
  
    res.json({users: users})
});


    // ogrenci isleri appointment
router.post('/studentAffairs/id=:id/wid=:wid',  async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
          );
        }
      else {
        let user;
        let userWith;
        let student;
      
        try {
          user = await User.findOne({_id: req.params.id})
          student = await Student.findOne({user: user})
          userWith = await User.findOne({_id:  req.params.wid})
          console.log(userWith)
          if(userWith && user)
          {
            let user1, userWith1, student1;
            let userAvailability = false;
            let userWithAvailability = false;
            for(const key of user.availableDates){
              let date = req.body.date
              let hours =  req.body.hours;

              if(key.date === date && key.hours === hours){
                userAvailability = true;

              }              
              }
            console.log(userAvailability)
            for(const key of userWith.availableDates){
              let date = req.body.date
              let hours =  req.body.hours;
              if(key.date === date && key.hours === hours){
                userWithAvailability = true;
                
              }
            }
            console.log(userWithAvailability)

            if(userWithAvailability === true && userAvailability === true){
              user1 = await User.updateOne(
                {_id: req.params.id} ,
                { $push: { appointments: {
                  with: userWith,
                  date : req.body.date,
                  hours: req.body.hours,
                  isActive: true        
                } } ,
              });
  
            user1 = await User.updateOne(
              {_id: req.params.id} ,
              { $pull: { availableDates: {date : req.body.date,
                hours: req.body.hours }} ,
              });
              userWith1 = await User.updateOne(
                {_id:userWith._id} ,
                { $push: { appointments: {
                  with: user,
                  date : req.body.date,
                  hours: req.body.hours,
                  isActive: true        
                } } ,
              });
  
            userWith1 = await User.updateOne(
              {_id: userWith._id} ,
              { $pull: { availableDates: { date : req.body.date,
                hours: req.body.hours }} ,
              });

              student1 = await Student.updateOne(
                {_id: student._id,'studentAffairsAppointments.appointmentsWith':userWith.name},
                {'$push': {
                  'studentAffairsAppointments.$.appointments': {
                  date : req.body.date,
                  hours: req.body.hours,} 
                }
              })
              if(student1.modifiedCount == 0 ){
                var studentAffairsAppointments = {
                  appointmentsWith: userWith.name,
                  appointments: [{
                    date : req.body.date,
                    hours: req.body.hours,
                  }]
                }
                student1 =  await Student.updateOne(
                  {_id: student._id}, {'$push': {
                    studentAffairsAppointments:studentAffairsAppointments}
                });
               }
            }
            
            
          }
          
        } catch (err) {
          const error = new HttpError(
            'User is empty .',
            500,
          );
          return next(error);
        }
      
        if (user) {
          res.redirect('/appointment/id='+user._id);
        } else {
          //req.flash('error_msg', 'Record not found.');
          res.redirect('/student');
        }
      }
    });

    // ogrenci isleri appointment
router.get('/it',  async (req, res, next) => {
  
  let department;
  let personnel;
  let user;
  let users = []
  try {
    department = await Department.findOne({name: "IT"});
    console.log(department)
    personnel = await Personnel.find({department: department});
    console.log(personnel)
    if(department && personnel)
    {
      console.log(personnel)
      for (const personel1 of personnel)
      {
        user = await User.findOne({_id: personel1.user});
        console.log(user)
        var userNames = {
          name: user.name,
          _id: user._id
        }
        users.push(userNames);
      }
      
    }
    
  } catch (err) {
    const error = new HttpError(
      'User is empty .',
      500,
    );
    return next(error);
  }

  res.json({users: users})
});


  // ogrenci isleri appointment
router.post('/it/id=:id/wid=:wid',  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
    else {
      let user;
      let userWith;
      let student;
    
      try {
        user = await User.findOne({_id: req.params.id})
        student = await Student.findOne({user: user})
        userWith = await User.findOne({_id:  req.params.wid})
        console.log(userWith)
        if(userWith && user)
        {
          let user1, userWith1, student1;
          let userAvailability = false;
          let userWithAvailability = false;
          for(const key of user.availableDates){
            let date = req.body.date
            let hours =  req.body.hours;

            if(key.date === date && key.hours === hours){
              userAvailability = true;

            }              
            }
          console.log(userAvailability)
          for(const key of userWith.availableDates){
            let date = req.body.date
            let hours =  req.body.hours;
            if(key.date === date && key.hours === hours){
              userWithAvailability = true;
              
            }
          }
          console.log(userWithAvailability)

          if(userWithAvailability === true && userAvailability === true){
            user1 = await User.updateOne(
              {_id: req.params.id} ,
              { $push: { appointments: {
                with: userWith,
                date : req.body.date,
                hours: req.body.hours,
                isActive: true        
              } } ,
            });

          user1 = await User.updateOne(
            {_id: req.params.id} ,
            { $pull: { availableDates: {date : req.body.date,
              hours: req.body.hours }} ,
            });
            userWith1 = await User.updateOne(
              {_id:userWith._id} ,
              { $push: { appointments: {
                with: user,
                date : req.body.date,
                hours: req.body.hours,
                isActive: true        
              } } ,
            });

          userWith1 = await User.updateOne(
            {_id: userWith._id} ,
            { $pull: { availableDates: { date : req.body.date,
              hours: req.body.hours }} ,
            });

            student1 = await Student.updateOne(
              {_id: student._id,'ITAppointments.appointmentsWith':userWith.name},
              {'$push': {
                'ITAppointments.$.appointments': {
                date : req.body.date,
                hours: req.body.hours,} 
              }
            })
            if(student1.modifiedCount == 0 ){
              var ITAppointments = {
                appointmentsWith: userWith.name,
                appointments: [{
                  date : req.body.date,
                  hours: req.body.hours,
                }]
              }
              student1 =  await Student.updateOne(
                {_id: student._id}, {'$push': {
                  ITAppointments:ITAppointments}
              });
             }

             
          }
          
          
        }
        
      } catch (err) {
        const error = new HttpError(
          'User is empty .',
          500,
        );
        return next(error);
      }
    
      if (user) {
        res.redirect('/appointment/id='+user._id);
      } else {
        //req.flash('error_msg', 'Record not found.');
        res.redirect('/student');
      }
    }
  });

  // Search Student Route.//admin
  router.post('/advisor/id=:id',  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
    else {
      let user;
      let userWith;
      let student;
      let lecturer;
      let userAvailability = false;
      let userWithAvailability = false;
      try {
        user = await User.findOne({_id: req.params.id})
        student = await Student.findOne({user: user})
        lecturer = await Lecturer.findOne({_id: student.advisor})
        userWith = await User.findOne({_id:lecturer.user})
        console.log(user)
        if(userWith && user)
        {
          let user1, userWith1, student1;
          for(const key of user.availableDates){
            let date = req.body.date
            let hours =  req.body.hours;

            if(key.date === date && key.hours === hours){
              userAvailability = true;
            }              
            }

          for(const key of userWith.availableDates){
            let date = req.body.date
            let hours =  req.body.hours;
            if(key.date === date && key.hours === hours){
              userWithAvailability = true;
            }
          }            
          if(userAvailability === true && userWithAvailability === true){
            user1 = await User.updateOne(
              {_id: req.params.id} ,
              { $push: { appointments: {
                with: userWith,
                date : req.body.date,
                hours: req.body.hours,
                isActive: true        
              } } ,
            });

          user1 = await User.updateOne(
            {_id: req.params.id} ,
            { $pull: { availableDates: {date : req.body.date,
              hours: req.body.hours }} ,
            });
            userWith1 = await User.updateOne(
              {_id:userWith._id} ,
              { $push: { appointments: {
                with: user,
                date : req.body.date,
                hours: req.body.hours,
                isActive: true        
              } } ,
            });

          userWith1 = await User.updateOne(
            {_id: userWith._id} ,
            { $pull: { availableDates: { date : req.body.date,
              hours: req.body.hours }} ,
            });

            student1 = await Student.updateOne(
              {_id: student._id,'advisorAppointments.appointmentsWith':lecturer.title},
              {'$push': {
                'advisorAppointments.$.appointments': {
                date : req.body.date,
                hours: req.body.hours,} 
              }
            })
            
           if(student1.modifiedCount == 0 ){
            var advisorAppointments = {
              appointmentsWith: lecturer.title,
              appointments: [{
                date : req.body.date,
                hours: req.body.hours
              }]
            }
            student1 =  await Student.updateOne(
              {_id: student._id}, {'$push': {
                advisorAppointments:advisorAppointments}
            });


          }
          
         }
        }
        
      } catch (err) {
        const error = new HttpError(
          'User is empty .',
          500,
        );
        return next(error);
      }
    
      if (user) {
        res.redirect('/appointment/id='+user._id);
      } else {
        //req.flash('error_msg', 'Record not found.');
        res.redirect('/student');
      }
    }
  });

  module.exports = router;