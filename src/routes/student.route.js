const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');

const Student = require('../models/student.model');

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
router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
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
router.post('/', [ensureAuthenticated, isAdmin], async (req, res, next) => {
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
    req.flash('error_msg', 'Record not found.');
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

// Add Student Form Route
router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
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
router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
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
    assignments: req.body.assignments,
    courses: req.body.courses,

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
        req.flash('success_msg', 'Information saved successfully.');
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
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
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
router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
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
    req.flash('success_msg', 'Student Details Updated Successfully.');
    res.redirect('/student');
  }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
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
    req.flash('success_msg', 'Record deleted successfully.');
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
      // req.flash('success_msg', 'Information saved successfully.');
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

module.exports = router;
