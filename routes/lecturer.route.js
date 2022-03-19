const express = require('express')
const router = express.Router()
var faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');
const { validationResult } = require('express-validator');


const {Lecturer} = require('../models/lecturer.model');

const {
    Department
} = require('../models/department.model');
const {
  User
} = require('../models/user.model');

const HttpError = require('../models/http-error.model');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');

// Students Home Route
router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {

   
    let lecturer;
    try {
        lecturer = await Lecturer.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching personnel failed, please try again later.',
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

        res.render('lecturer/index', {
            title: 'Lecturer',
            breadcrumbs: true,
            search_bar: true,
            lecturer: lecturer,
            pages: pages
          
        });
    } else {
        res.render('lecturer/index', {
            title: 'Lecturer',
            breadcrumbs: true,
            search_bar: true
        });
    }
});


// Personnel Detail's Route
router.get('/:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
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
    if (personnel) {
        res.render('lecturer/details', {
            title: 'Details',
            breadcrumbs: true,
            lecturer: lecturer
        });
    } else {
        req.flash('error_msg', 'No records found...');
    }
});


// Personnel Dept's Route
router.get('/:dept', async (req, res, next) => {
    let lecturer;
    try{
        lecturer = await Lecturer.find({
            department: req.params.dept
        }).select({
          LecturerName: {
            FirstName: 1,
            LastName: 1
        },
            _id: 0
        });
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
    
  
    if (lecturer)
        res.send(lecturer);
    else
    {
        const error = new HttpError(
          'Could not find lecturer for the provided department id.',
            404
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
          500
        );
        return next(error);
      }
   
    if (dept && user ) {
        res.render('lecturer/add', {
            title: 'Add New Lecturer',
            breadcrumbs: true,
            dept: dept,
            user: user
        });
    }
});

// Process Students Form Data And Insert Into Database.
router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
        const lecturer = new Lecturer({
            StudentName: {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName
            },
            DateOfAdmission: req.body.DateOfAdmission,
            Status: req.body.Status,
            Email: req.body.Email,
            Address: {
                AddrType: req.body.AddrType,
                City: req.body.City,
                State: req.body.State,
                PostalCode: req.body.PostalCode,
                Country: req.body.Country
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
            result = await Lecturer.findOne({
                'Email': req.body.Email
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
                result = await lecturer.save();

                if (result) {
                    req.flash('success_msg', 'Information saved successfully.');
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

// Student Edit Form
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
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
    if (lecturer && user && dept ) {
        res.render('lecturer/edit', {
            title: 'Edit Lecturer Details',
            breadcrumbs: true,
            lecturer: lecturer,
            dept: dept,
            user: user
        });
    }
});

// Student Update Route
router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
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
                  LecturerName: {
                    FirstName: req.body.FirstName,
                    LastName: req.body.LastName
                },
                DateOfAdmission: req.body.DateOfAdmission,
                Status: req.body.Status,
                Email: req.body.Email,
                Address: {
                    AddrType: req.body.AddrType,
                    City: req.body.City,
                    State: req.body.State,
                    PostalCode: req.body.PostalCode,
                    Country: req.body.Country
                },
                Contact: {
                  ContactType: req.body.ContactType,
                  Value: req.body.Value,
              },
                Department: req.body.Department,
                User: req.body.User,
            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (lecturer) {
            req.flash('success_msg', 'Lecturer Details Updated Successfully.');
            res.redirect('/lecturer');
        }
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
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
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/lecturer');
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
});*/


// Faker
router.get('/faker', async (req, res, next) => {
    for (let i = 0; i < 2; i++) {
        const lecturer = new Lecturer({
            LecturerName: {
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
              Country: faker.address.country()
          },
          Contact: {
            ContactType:'Cep Telefonu',
            Value: faker.phone.phoneNumber(),
        },
          Department: '',
          User: ''
          
      });

      let result;
        try {
        result = await lecturer.save();

        if (result) {
            req.flash('success_msg', 'Information saved successfully.');
            res.redirect('/lecturer');
        }
    } catch (ex) {
        const error = new HttpError(
            'Something went wrong.',
            500
          );
          return next(error);
    }

  }});


module.exports = router;