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
          date:req.body.date
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

  // Search Student Route.//admin
  router.post('/id=:id/wid=:wid',  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
    else {
      let user;
      let userWith;
      try {
        userWith = await User.findOne({_id: req.params.wid})
        user = await User.findOne({_id: req.params.id})
        if(userWith && user)
        {
          let user1, userWith1;
          for(const key of user.availableDates){
            let date = new Date(req.body.date)
            if(key.date.getUTCDate() === date.getUTCDate() ){
              user1 = await User.updateOne(
                {_id: req.params.id} ,
                { $push: { appointments: {
                  with: userWith,
                  date : req.body.date,
                  isActive: true        
                } } ,
              });
            user1 = await User.updateOne(
              {_id: req.params.id} ,
              { $pull: { availableDates: { _id: key._id }} ,
              });
            }              
            }
            console.log(userWith.availableDates)

          for(const key of userWith.availableDates){
            let date = new Date(req.body.date)
            if(key.date.getUTCDate() === date.getUTCDate() ){

              userWith1 = await User.updateOne(
                {_id: req.params.wid} ,
                { $push: { appointments: {
                  with: user,
                  date : req.body.date,
                  isActive: true        
                } } ,
              });

            userWith1 = await User.updateOne(
              {_id: req.params.id} ,
              { $pull: { availableDates: { _id: key._id }} ,
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