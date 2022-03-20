const express = require('express');

const router = express.Router();
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const Department = require('../models/department.model');
const DepartmentController = require('../controllers/department.controller');

const {
  ensureAuthenticated,
  isAdmin,
  isLoggedIn,
  createAccessControl,
  readAccessControl,
  updateAccessControl,
  deleteAccessControl,
} = require('../middleware/auth');

router.get('/name=:name', async (req, res, next) => {
  const result = await DepartmentController.findByName(req.params.name);
  if (!result) {
    next(result);
    return;
  }
  res.json(result);
});
// Students Home Route
router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
  let department;
  try {
    department = await Department.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching department failed, please try again later.',
      500,
    );
    return next(error);
  }

  if (department.length > 0) {
    let pages;
    try {
      pages = await Department.find().countDocuments();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500,
      );
      return next(error);
    }

    res.render('department/index', {
      title: 'Department',
      breadcrumbs: true,
      search_bar: true,
      department,
      pages,

    });
  } else {
    res.render('department/index', {
      title: 'Department',
      breadcrumbs: true,
      search_bar: true,
    });
  }
});

// Personnel Detail's Route
router.get('/:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
  let department;
  try {
    department = await Department.findOne({
      _id: req.params.id,
    });
  } catch (err) {
    const error = new HttpError(
      'Department is empty .',
      500,
    );
    return next(error);
  }
  if (department) {
    res.render('department/details', {
      title: 'Details',
      breadcrumbs: true,
      department,
    });
  } else {
    req.flash('error_msg', 'No records found...');
  }
});

// Add Personnel Form Route
router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
  res.render('department/add', {
    title: 'Add New Department',
    breadcrumbs: true,
  });
});

// Process Students Form Data And Insert Into Database.
router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const department = new Department({

    name: req.body.name,
    curriculum: req.body.curriculum,

  });

  let result;
  try {
    result = await Department.findOne({
      name: req.body.name,
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
      result = await department.save();

      if (result) {
        req.flash('success_msg', 'Information saved successfully.');
        res.redirect('/department');
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
      'Department Already Exists.',
      500,
    );
    return next(error);
  }
});

// Department Edit Form
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
  let dept;
  try {
    dept = await Department.findOne({
      _id: req.params.id,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong.',
      500,
    );
    return next(error);
  }
  res.render('personnel/edit', {
    title: 'Edit Personnel Details',
    breadcrumbs: true,
    dept,
  });
});

// Department Update Route
router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
  let department;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  try {
    department = await Department.update({
      _id: req.params.id,
    }, {
      $set: {
        name: req.body.name,
        curriculum: req.body.curriculum,
      },
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500,
    );
    return next(error);
  }

  if (department) {
    req.flash('success_msg', 'Department Details Updated Successfully.');
    res.redirect('/department');
  }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
  let result;
  try {
    result = await Department.remove({
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
    res.send('/department');
  } else {
    res.status(500).send();
  }
});

/*
router.delete('/multiple/:id', async (req, res) => {
    let str = req.params.id;

    for (i in str) {
        console.log(i);
    }

    const result = await Student.find({
        _id: {
            $in: []
        }
    });
    console.log(result);
    if (result) {
        req.flash('success_msg', 'Records deleted successfully.');
        res.send('/students');
    } else {
        res.status(500).send();
    }

    //let str = '[' + req.params.id + ']';
    //console.log(str);
}); */

module.exports = router;
