const express = require('express')
const router = express.Router()
var faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');
const { validationResult } = require('express-validator');


const {Personel} = require('../models/personel.model');

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
    let personel;
    try {
        personel = await Personel.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching personel failed, please try again later.',
          500
        );
        return next(error);
      }

    if (personel.length > 0) {
        let pages;
      try {
          pages = await Personel.find().countDocuments();

      }  catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500
          );
          return next(error);
        }

        res.json({ 
          personel: personel.toObject({ getters: true }),
          pages: pages
        });
    } else {
      res.json({ personel: personel.toObject({ getters: true })});
    }
});


// Personel Detail's Route
router.get('/:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
    let personel;
    try{
        personel = await Personel.findOne({
            _id: req.params.id
        });
    }
    catch (err) {
        const error = new HttpError(
          'Personel is empty .',
          500
        );
        return next(error);
      }
    if (personel) {
      res.json({ personel: personel.toObject({ getters: true })});
    } else {
        req.flash('error_msg', 'No records found...');
    }
});


// Personel Dept's Route
router.get('/:dept', async (req, res, next) => {
    let personel;
    try{
        personel = await Personel.find({
            department: req.params.dept
        }).select({
          PersonelName: {
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
    
  
    if (personel)
    res.json({ personel: personel.toObject({ getters: true })});
    else
    {
        const error = new HttpError(
          'Could not find student for the provided department id.',
            404
          );
          return next(error);
    }
        
  });

// Add Personel Form Route
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
      res.json({ 
        dept: dept.toObject({ getters: true }),
        user: user.toObject({ getters: true })
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
        const personel = new Personel({
            PersonelName: {
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
            result = await Personel.findOne({
                'Email': req.body.Email
            });
            
        } catch (err) {
            const error = new HttpError(
              'Something went wrong',
              500
            );
            return next(error);
          }
       

        if (!result) {
            try {
                result = await personel.save();

                if (result) {
                    req.flash('success_msg', 'Information saved successfully.');
                    res.redirect('/personel');
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
                    'Personel Already Exists.',
                    500
                  );
                  return next(error);
        }
    }
});

// Student Edit Form
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let personel;
    try {
        personel = await Personel.findOne({
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
    if (personel && user && dept ) {
      res.json({ 
        personel: personel.toObject({ getters: true }),
        dept: dept.toObject({ getters: true }),
        user: user.toObject({ getters: true })
      });
    }
});

// Student Update Route
router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let personel;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            personel = await Personel.update({
                _id: req.params.id
            }, {
                $set: {
                  PersonelName: {
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
                User: req.body.User
            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (personel) {
            req.flash('success_msg', 'Personel Details Updated Successfully.');
            res.redirect('/personel');
        }
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
    let result;
    try {
        result = await Personel.remove({
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
        res.redirect('/personel');
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
        const personel = new Personel({
            PersonelName: {
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
        result = await personel.save();

        if (result) {
            req.flash('success_msg', 'Information saved successfully.');
            res.redirect('/personel');
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