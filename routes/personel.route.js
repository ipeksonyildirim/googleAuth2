const express = require('express');

const router = express.Router();
const faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');
const { validationResult } = require('express-validator');

const { Personnel } = require('../models/personnel.model');

const {
  Department,
} = require('../models/department.model');
const {
  User,
} = require('../models/user.model');

const HttpError = require('../models/http-error.model');

const {
  ensureAuthenticated,
  isAdmin,
  isLoggedIn,
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

    res.render('personnel/index', {
      title: 'Personnel',
      breadcrumbs: true,
      search_bar: true,
      personnel,
      pages,

    });
  } else {
    res.render('personnel/index', {
      title: 'Personnel',
      breadcrumbs: true,
      search_bar: true,
    });
  }
});

// Personnel Detail's Route
router.get('/:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
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
    res.render('personnel/details', {
      title: 'Details',
      breadcrumbs: true,
      personnel,
    });
  } else {
    req.flash('error_msg', 'No records found...');
  }
});

// Personnel Dept's Route
router.get('/:dept', async (req, res, next) => {
  let personnel;
  try {
    personnel = await Personnel.find({
      department: req.params.dept,
    }).select({
      PersonnelName: {
        FirstName: 1,
        LastName: 1,
      },
      _id: 0,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500,
    );
    return next(error);
  }

  if (personnel) res.send(personnel);
  else {
    const error = new HttpError(
      'Could not find student for the provided department id.',
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
    user = await User.find();
    dept = await Department.find();
  } catch (err) {
    const error = new HttpError(
      'User or Department is empty .',
      500,
    );
    return next(error);
  }

  if (dept && user) {
    res.render('personnel/add', {
      title: 'Add New Personnel',
      breadcrumbs: true,
      dept,
      user,
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
    PersonnelName: {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
    },
    DateOfAdmission: req.body.DateOfAdmission,
    Status: req.body.Status,
    Email: req.body.Email,
    Address: {
      AddrType: req.body.AddrType,
      City: req.body.City,
      State: req.body.State,
      PostalCode: req.body.PostalCode,
      Country: req.body.Country,
    },
    Contact: {
      ContactType: req.body.ContactType,
      Value: req.body.Value,
    },
    Department: req.body.Department,
    User: req.body.User,

  });

  let result;
  try {
    result = await Personnel.findOne({
      Email: req.body.Email,
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
  if (personnel && user && dept) {
    res.render('personnel/edit', {
      title: 'Edit Personnel Details',
      breadcrumbs: true,
      personnel,
      dept,
      user,
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
        PersonnelName: {
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
        },
        DateOfAdmission: req.body.DateOfAdmission,
        Status: req.body.Status,
        Email: req.body.Email,
        Address: {
          AddrType: req.body.AddrType,
          City: req.body.City,
          State: req.body.State,
          PostalCode: req.body.PostalCode,
          Country: req.body.Country,
        },
        Contact: {
          ContactType: req.body.ContactType,
          Value: req.body.Value,
        },
        Department: req.body.Department,
        User: req.body.User,
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
    res.send('/personnel');
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

// Faker
router.get('/faker', async (req, res, next) => {
  for (let i = 0; i < 2; i++) {
    const personnel = new Personnel({
      PersonnelName: {
        FirstName: faker.name.firstName(),
        LastName: faker.name.lastName(),
      },

      DateOfAdmission: moment(faker.date.recent()).format('LL'),
      Status: 'aktif',
      Email: faker.internet.email(),
      Address: {
        AddrType: 'Ev Adresi',
        City: faker.address.city(),
        State: faker.address.state(),
        PostalCode: faker.address.zipCode(),
        Country: faker.address.country(),
      },
      Contact: {
        ContactType: 'Cep Telefonu',
        Value: faker.phone.phoneNumber(),
      },
      Department: '',
      User: '',

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
