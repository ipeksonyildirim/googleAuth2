const express = require('express');

const router = express.Router();
const faker = require('faker');
const moment = require('moment');
const { validationResult } = require('express-validator');

const Personnel = require('../models/personnel.model');
const Department = require('../models/department.model');
const User = require('../models/user.model');
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
  let personnel;
  try {
    personnel = await Personnel.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching personnel failed, please try again later.',
      500,
    );
    return next(error);
  }

  if (personnel.length > 0) {
    let pages;
    try {
      pages = await Personnel.find().countDocuments();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500,
      );
      return next(error);
    }

    res.json({ 
      personnel: personnel.toObject(),
      pages: pages
    });
} else {
  res.json({ 
    personnel: personnel.toObject(),
  });
}
});

// Personnel Detail's Route
router.get('/id=:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
  let personnel;
  try {
    personnel = await Personnel.findOne({
      _id: req.params.id,
    });
  } catch (err) {
    const error = new HttpError(
      'Personnel is empty .',
      500,
    );
    return next(error);
  }
  if (personnel) {
    res.json({ 
      personnel: personnel.toObject(),
    });
  } else {
      req.flash('error_msg', 'No records found...');
  }
});

// Personnel Dept's Route
router.get('/dept=:dept', async (req, res, next) => {
  let personnel;
  try {
    personnel = await Personnel.find({
      department: req.params.dept
    }).populate('user').select({
      name:1,
      _id: 0
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }

  if (personnel.length>0){
    res.json({ 
      personnel: personnel.toObject(),
    });
    }  
    else {
    const error = new HttpError(
      'Could not find personnel for the provided department id.',
      404,
    );
    return next(error);
  }
});

// Add Personnel Form Route
router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
  let user;
  let dept;
  try {
    user = await User.find({});
    dept = await Department.find({});
  } catch (err) {
    const error = new HttpError(
      'User or Department is empty .',
      500,
    );
    return next(error);
  }

  if (dept.length>0 && user.length>0) {
    res.json({ 
      dept: dept.toObject(),
      user: user.toObject()
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

  const personnel = new Personnel({
    user: req.body.user,
    department: req.body.department,

  });

  let result;
  try {
    result = await Personnel.findOne({
      user: req.body.user,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong',
      500,
    );
    return next(error);
  }

  if (!result) {
    try {
      result = await personnel.save();

      if (result) {
        req.flash('success_msg', 'Information saved successfully.');
        res.redirect('/personnel');
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
      'Personnel Already Exists.',
      500,
    );
    return next(error);
  }
});

// Student Edit Form
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
  let personnel;
  try {
    personnel = await Personnel.findOne({
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
  try {
    user = await User.find();
    dept = await Department.find();
  } catch (err) {
    const error = new HttpError(
      'User or Department is empty .',
      500,
    );
    return next(error);
  }
  if (personnel && user.length>0 && dept.length>0) {
    res.json({
      personnel: personnel.toObject(),
      dept: dept.toObject(),
      user: user.toObject()
    });
  }
});

// Student Update Route
router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
  let personnel;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  try {
    personnel = await Personnel.update({
      _id: req.params.id,
    }, {
      $set: {
        user: req.body.user,
    department: req.body.department,
      },
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500,
    );
    return next(error);
  }

  if (personnel) {
    req.flash('success_msg', 'Personnel Details Updated Successfully.');
    res.redirect('/personnel');
  }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
  let result;
  try {
    result = await Personnel.remove({
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
    res.redirect('/personnel');
  } else {
    res.status(500).send();
  }
});


// Faker
router.get('/faker', async (req, res, next) => {
  for (let i = 0; i < 2; i++) {
    const personnel = new Personnel({
      user: req.user,
      department: ''

    });

    let result;
    try {
      result = await personnel.save();

      if (result) {
        req.flash('success_msg', 'Information saved successfully.');
        res.redirect('/personnel');
      }
    } catch (ex) {
      const error = new HttpError(
        'Something went wrong.',
        500,
      );
      return next(error);
    }
  }
});

module.exports = router;
