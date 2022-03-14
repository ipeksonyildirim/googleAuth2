const express = require('express')
const router = express.Router()
var faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');
const { validationResult } = require('express-validator');


const {Student} = require('../models/student.model');

const {
    Department
} = require('../models/department.model');
const {
  User
} = require('../models/user.model');
const {
  Lecturer
} = require('../models/lecturer.model');
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

    const perPage = 7;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    const sort = req.query.sort || "asc";
    let student;
    try {
        student = await Student.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching users failed, please try again later.',
          500
        );
        return next(error);
      }

    if (student.length > 0) {
        const pages = await Student.countDocuments();

        res.render('students/index', {
            title: 'Students',
            breadcrumbs: true,
            search_bar: true,
            students: student,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage),
            total: pages,
            perPage: perPage,
            skip: skip,
            to: (student.length + 10)
        });
    } else {
        res.render('students/index', {
            title: 'Students',
            breadcrumbs: true,
            search_bar: true
        });
    }
});


// Student Detail's Route
router.get('/:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
    let student;
    try{
        student = await Student.findOne({
            _id: req.params.id
        });
    }
    catch (err) {
        const error = new HttpError(
          'User, Department or  Lecturer is empty .',
          500
        );
        return next(error);
      }
    if (student) {
        res.render('students/details', {
            title: 'Details',
            breadcrumbs: true,
            student: student
        });
    } else {
        req.flash('error_msg', 'No records found...');
    }
});

// Search Student Route.//admin
router.post('/', [ensureAuthenticated, isAdmin], async (req, res, next) => {
    let key = req.body.searchInput;
    let student;
    try {
        student = await Student.find({
            'StudentId': key
        });
    }catch (err) {
        const error = new HttpError(
          'User, Department or  Lecturer is empty .',
          500
        );
        return next(error);
      }

    if (student.length > 0) {
        res.render('students/index', {
            title: 'Student',
            breadcrumbs: true,
            search_bar: true,
            students: student
        });
    } else {
        req.flash('error_msg', 'Record not found.');
        res.redirect('/students');
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
          500
        );
        return next(error);
      }
   
    if (dept && user && lecturer) {
        res.render('students/add', {
            title: 'Add New Student',
            breadcrumbs: true,
            dept: dept,
            user: user,
            lecturer: lecturer
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
        const student = new Student({
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
            Internship: {
            Year: req.body.Year,
            Term: req.body.Term,
            CompanyName: req.body.CompanyName,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate
          },
            Scholarship: req.body.Scholarship,
            Class: req.body.Class,
            EducationTerm: req.body.EducationTerm,
            Gpa: req.body.Gpa,
            SecondForeignLanguage: req.body.SecondForeignLanguage,
            Department: req.body.Department,
            User: req.body.User,
            Advisor: req.body.Advisor,
            Credit: req.body.Credit,
            StudentId: req.body.StudentId,
            
        });

        const result = await Student.findOne({
            'StudentId': req.body.StudentId
        });

        if (!result) {
            try {
                const result = await student.save();

                if (result) {
                    req.flash('success_msg', 'Information saved successfully.');
                    res.redirect('/students');
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
                    'StudentId Already Exists.',
                    500
                  );
                  return next(error);
        }
    }
});

// Student Edit Form
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let student;
    try {
        student = await Student.findOne({
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
    let lecturer;
    try {
        user = await User.find();
        dept = await Department.find();
        lecturer = await Lecturer.find();
      } catch (err) {
        const error = new HttpError(
          'User, Department or  Lecturer is empty .',
          500
        );
        return next(error);
      }
    if (student && user && dept && lecturer) {
        res.render('students/edit', {
            title: 'Edit Student Details',
            breadcrumbs: true,
            student: student,
            dept: dept,
            user: user,
            advisor: lecturer
        });
    }
});

// Student Update Route
router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let student;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            student = await Student.update({
                _id: req.params.id
            }, {
                $set: {
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
                Internship: {
                Year: req.body.Year,
                Term: req.body.Term,
                CompanyName: req.body.CompanyName,
                StartDate: req.body.StartDate,
                EndDate: req.body.EndDate
              },
                Scholarship: req.body.Scholarship,
                Class: req.body.Class,
                EducationTerm: req.body.EducationTerm,
                Gpa: req.body.Gpa,
                SecondForeignLanguage: req.body.SecondForeignLanguage,
                Department: req.body.Department,
                User: req.body.User,
                Advisor: req.body.Advisor,
                Credit: req.body.Credit,
                StudentId: req.body.StudentId,
                
            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (student) {
            req.flash('success_msg', 'Student Details Updated Successfully.');
            res.redirect('/students');
        }
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
    let result;
    try {
        result = await Student.remove({
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
        res.send('/students');
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
        const student = new Student({
            StudentName: {
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
          Internship: {
          Year: 2019,
          Term: 'Guz',
          CompanyName: 'XYZ A.Ş.',
          StartDate: '2019-12-05',
          EndDate: '2019-30-08'
        },
          Scholarship: 75,
          Class: 3,
          EducationTerm: 6,
          Gpa: 3.5,
          SecondForeignLanguage: 'Almanca',
          Department: '',
          User: '',
          Advisor: '',
          Credit: 42,
          StudentId: randomString.generate({
            length: 9,
            charset: 'numeric'
        }),
          
      });

      const result = await student.save();
  }});


module.exports = router;