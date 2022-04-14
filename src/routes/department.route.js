const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const Department = require('../models/department.model');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');

// Department Home Route
router.get('/',async (req, res, next) => {

   
    let department;
    try {
        department = await Department.find({});
      } catch (err) {
        const error = new HttpError(
          'Fetching department failed, please try again later.',
          500
        );
        return next(error);
      }

    if (department.length > 0) {
        let pages;
      try {
          pages = await Department.find().countDocuments();

      }  catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500
          );
          return next(error);
        }

        res.json({ 
            department: department,
            pages: pages
          });
    }
    else{
      res.redirect('/department/add');
    }
});

// Department Search by id's Route
router.get('/id=:id',async (req, res, next) => {
  let department;
  try{
      department = await Department.findOne({
          _id: req.params.id
      });
  }
  catch (err) {
      const error = new HttpError(
        'Department is empty .',
        500
      );
      return next(error);
    }
  if (department) {
      res.json({ 
          department: department,
        });
  } else {
      //req.flash('error_msg', 'No records found...');
  }
});

// Department Search by name's Route
router.get('/name=:name', async (req, res, next) => {
  let department;
  try{
    console.log(req.params.name);
      department = await Department.findOne({
          name: req.params.name
      });
  }
  catch (err) {
      const error = new HttpError(
        'Department is empty .',
        500
      );
      return next(error);
    }
  if (department) {
      res.json({ 
          department: department,
        });
  } else {
      //req.flash('error_msg', 'No records found...');
  }
});

// Add Department Form Route
router.get('/add',async (req, res, next) => {
  res.status(200).send();
});

// Process Department Form Data And Insert Into Database.
router.post('/add', async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
        const department = new Department({
           
            name: req.body.name,
            curriculum: req.body.curriculum
          
            
        });

        let result;
        try {
            result = await Department.findOne({
                'name': req.body.name
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
                result = await department.save();

                if (result) {
                    //req.flash('success_msg', 'Information saved successfully.');
                    res.redirect('/department');
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
                    'Department Already Exists.',
                    500
                  );
                  return next(error);
        }
    }
});

// Department Edit Form
router.get('/edit', async (req, res, next) => {
    let dept;
    try {
        dept = await Department.find({
        });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong.',
            500
          );
          return next(error);
    }
    if(dept.length>0)
      res.json({ dept: dept});
  
});

// Department Update Route
router.put('/edit/:id', async (req, res, next) => {
    let department;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            department = await Department.update({
                _id: req.params.id
            }, {
                $set: {
                    name: req.body.name,
                    curriculum: req.body.curriculum
            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (department) {
            //req.flash('success_msg', 'Department Details Updated Successfully.');
            res.redirect('/department');
        }
    }
});

// Department Delete Route
router.delete('/:id', async (req, res, next) => {
    let result;
    try {
        result = await Department.remove({
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
        //req.flash('success_msg', 'Record deleted successfully.');
        res.redirect('/department');
    } else {
        res.status(500).send();
    }
});



module.exports = router;