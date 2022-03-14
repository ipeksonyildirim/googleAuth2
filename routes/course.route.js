const express = require('express');
const router = express.Router();
const moment = require('moment');
const { validationResult } = require('express-validator');

const {
    Department
} = require('../models/department.model');
const {
    Course
} = require('../models/course.model');

const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');
const HttpError = require('../models/http-error.model');

router.get('/getCourse/:dept', async (req, res, next) => {
    let course;
    try{
        course = await Course.find({
            department: req.params.dept
        }).select({
            shortCode: 1,
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
    

    if (course)
        res.send(course);
    else
    {
        const error = new HttpError(
            'Could not find a course for the provided id.',
            404
          );
          return next(error);
    }
        
});

router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {

    const perPage = 8;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage);

    const dept = await Department.find();
    const course = await Course.find().skip(skip).limit(perPage);

    if (dept &&  course) {
        const pages = await Course.find().countDocuments();

        res.render('courses/index', {
            title: 'Courses',
            breadcrumbs: true,
            search_bar: true,
            dept: dept,
            course: course,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage)
        });
    } else if (dept) {
        res.render('courses/index', {
            title: 'Courses',
            breadcrumbs: true,
            search_bar: true,
            dept: dept
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
    if (dept) {
        res.render('courses/add', {
            title: 'Add New Course',
            breadcrumbs: true,
            dept: dept
        });
    }
});

router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
    const dept = await Department.find();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    else {
       
        const course = new Course({
            shortCode: req.body.shortCode,
            name: req.body.name,
            credit: req.body.credit,
            department: req.body.department,
            termYear: req.body.termYear,
            termName: req.body.termName,
            lessonHours: {
                day: req.body.day,
                startedHours: req.body.startedHours,
                finishedHours: req.body.finishedHours,
                location: req.body.location,
                zoomId: req.body.zoomId
            },
        });

        try {
            const result = await course.save();

            if (result) {
                req.flash('success_msg', 'Course saved successfully.');
                res.redirect('/courses');
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
            _id: req.param.id
        });
    
      } catch (err) {
        const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
      }
    
    if (course && dept) {
        res.render('courses/edit', {
            title: 'Edit Course',
            breadcrumbs: true,
            dept: dept,
            course: course
        });
    }
});

router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let course;
    try {
        course = await Course.update({
            _id: req.param.id
        }, {
            $set: {
                shortCode: req.body.shortCode,
            name: req.body.name,
            credit: req.body.credit,
            department: req.body.department,
            termYear: req.body.termYear,
            termName: req.body.termName,
            lessonHours: {
                day: req.body.day,
                startedHours: req.body.startedHours,
                finishedHours: req.body.finishedHours,
                location: req.body.location,
                zoomId: req.body.zoomId
            }
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
        res.redirect('/courses');
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
        res.send('/courses');
    }
});

module.exports = router;