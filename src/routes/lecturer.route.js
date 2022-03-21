const express = require('express')
const router = express.Router()
var faker = require('faker');
const moment = require('moment');
const { validationResult } = require('express-validator');


const Lecturer = require('../models/lecturer.model');
const Department= require('../models/department.model');
const User = require('../models/user.model');
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
          'Fetching personel failed, please try again later.',
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

        res.json({ 
          lecturer: lecturer.toObject(),
          pages: pages
        });
    } else {
      res.json({ 
        lecturer: lecturer.toObject(),
      });
    }
});


// Personel Detail's Route
router.get('/id=:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
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
    if (lecturer) {
      res.json({ 
        lecturer: lecturer.toObject(),
      });
    } else {
        req.flash('error_msg', 'No records found...');
    }
});


// Personel Dept's Route
router.get('/dept=:dept', async (req, res, next) => {
    let lecturer;
    try{
        lecturer = await Lecturer.find({
            department: req.params.dept
          }).populate('user').select({
            name:1,
            _id: 0
          });
  
    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
    
  
    if (lecturer.length>0){
      res.json({ 
        lecturer: lecturer.toObject(),
      });
    }
    else
    {
        const error = new HttpError(
          'Could not find lecturer for the provided department id.',
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
   
    if (dept.length>0 && user.length>0 ) {
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
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
        const lecturer = new Lecturer({            
            user: req.body.user,
            department: req.body.department,
            status: req.body.status,
            courses: req.body.courses    
        });

        let result;
        try {
            result = await Lecturer.findOne({
                'user': req.body.user
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
    if (lecturer && user.length>0 && dept.length>0 ) {
      res.json({
        lecturer: lecturer.toObject(),
        dept: dept.toObject(),
        user: user.toObject()
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
                  user: req.body.user,
            department: req.body.department,
            status: req.body.status,
            courses: req.body.courses   
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
        res.redirect('/lecturer');
    } else {
        res.status(500).send();
    }
});



// Faker
router.get('/faker', async (req, res, next) => {
    
        const lecturer = new Lecturer({
          user: req.user,
          department: '',
          status: 'aktif',
          courses: ''  
          
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

  });


module.exports = router;