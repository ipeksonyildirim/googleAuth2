const express = require('express');
const router = express.Router();
const moment = require('moment');
const { validationResult } = require('express-validator');

const Department = require('../models/department.model');
const Course = require('../models/course.model');

const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');
const HttpError = require('../models/http-error.model');

router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {

  let dept;
  let course;
  try {
      dept = await Department.find();
      course = await Course.find();
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (dept.length>0 &&  course.length>0) {
      let pages;
      try {
          pages = await Course.find().countDocuments();

      }  catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500
          );
          return next(error);
        }

      res.json({ 
        course: course,
        dept: dept,
        pages: pages
      });
  } else if (dept) {
    res.json({ 
      dept: dept,
      pages: pages
    });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
  let dept;
  try {
      dept = await Department.find();
    } catch (err) {
      const error = new HttpError(
        'User, Department is empty .',
        500
      );
      return next(error);
    }
  if (dept.length > 0) {
    res.json({ dept: dept});
  }
});
router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
     
      const course = new Course({
          code: req.body.code,
          name: req.body.name,
          credit: req.body.credit,
          department: req.body.department,
          terms: req.body.terms,
          schedule: {
              day: req.body.day,
              time: req.body.time,
              location: req.body.location,
              zoomId: req.body.zoomId
          },
          assignments: {
            assignment: req.body.assignment,
            isActive: req.body.isActive
        },
        students: req.body.students,
        lecturers: req.body.lecturers,
      });

      try {
          const result = await course.save();

          if (result) {
              req.flash('success_msg', 'Course saved successfully.');
              res.redirect('/course');
          }
      } catch (ex) {
          const error = new HttpError(
              'Something went wrong.',
              500
            );
            return next(error);
      }
  }
});

router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
  let dept;
  let course;
  try {
      dept = await Department.find();
      course = await Course.findOne({
          _id: req.params.id
      });
  
    } catch (err) {
      const error = new HttpError(
        'Something went wrong.',
        500
      );
      return next(error);
    }
  
  if (course && dept.length>0) {
    res.json({ 
      dept: dept,
      course: course,
  });
  }
});

router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
  let course;
  try {
      course = await Course.update({
          _id: req.params.id
      }, {
          $set: {
            code: req.body.code,
            name: req.body.name,
            credit: req.body.credit,
            department: req.body.department,
            terms: req.body.terms,
            schedule: {
                day: req.body.day,
                time: req.body.time,
                location: req.body.location,
                zoomId: req.body.zoomId
            },
            assignments: {
              assignment: req.body.assignment,
              isActive: req.body.isActive
          },
          students: req.body.students,
          lecturers: req.body.lecturers,
          }
      });
  
  
    } catch (err) {
      const error = new HttpError(
        'Something went wrong.',
        500
      );
      return next(error);
    }
  
  if (course) {
      req.flash('success_msg', 'Course Updated Successfully.');
      res.redirect('/course');
  } 
});

router.get('/dept=:dept', async (req, res, next) => {
    let course;
    try{
        course = await Course.find({
            department: req.params.dept
        }).select({
            code: 1,
            name: 1,
            _id: 0
        });

    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
    

    if (course.length>0)
    res.json({ course: course });
    else
    {
        const error = new HttpError(
            'Could not find a course for the provided id.',
            404
          );
          return next(error);
    }
        
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
    let result;
    try {
        result = await Course.remove({
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
        req.flash('success_msg', 'Record deleted successfully.');
        res.redirect('/course');
    }
});

module.exports = router;