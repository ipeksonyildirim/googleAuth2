const express = require('express')
const router = express.Router();
const HttpError = require('../models/http-error.model');
const passport = require('passport');
const { validationResult } = require('express-validator');

const User = require('../models/user.model')
const Student = require('../models/student.model')
const Lecturer = require('../models/lecturer.model');
const Personnel = require('../models/personnel.model');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');

// Public Routes.

// @desc Login/Landing page
//@route GET /
router.get('/',isLoggedIn, (req, res) => {
  res.send('<a href="/auth/google"> Authenticate with Google </a>');
});

// @desc dashboard
//@route GET /dashboard
router.get('/dashboard', ensureAuthenticated,async (req, res,next) => {
  const id  = req.session.passport.user;
  try {
    const user1 = await User.findById( id);
    res.json(`hello  ${user1.name}`)
  } catch (err) {
    const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
  }
});

// @desc getUser
//@route GET /user
router.get('/getUser', async (req, res,next) => {
  if(!req.session || !req.session.passport)
    res.json({user: null})
  else{
    const id  = req.session.passport.user;
    try {
      const user1 = await User.findById( id);
      const student = await Student.findOne({user: user1})
      console.log(student)
      let studentId;
      if(student)
        studentId = student._id

      var user = {
        _id: user1._id,
        email: user1.email,
        name: user1.name,
        image: user1.image,
        isAdmin: user1.isAdmin,
        studentId: studentId
      }
      res.json({user: user})
    } catch (err) {
      const error = new HttpError(
          'Fetching users failed, please try again later.',
          500
        );
        return next(error);
    }
  }
});

// @desc Logout
//@route GET /logout

router.get('/logout', (req, res) => {
  if(req.user){
    req.logout();
    res.send('done');
  }
})

// Protected Routes.

router.get('/user', async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user)});
   
});


router.get('/user/id=:id',  async (req, res, next) => {
  let user;
  try {
    user = await User.find({_id: req.params.id});
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  if(user.length>0){
    res.json({
      user: user
    });
  }
  
   
});


router.delete('/user/:id', async (req, res) => {
    let user;
    
    try {
      user = await User.remove({
        _id: req.param.id
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
        res.redirect('/user');
    }
});

// Edit User Account.

router.get('/user/edit/:id',  async (req, res) => {

  let user;
  try {
    user = await User.find({_id: req.params.id});
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  if(user.length>0){
    res.json({
      user: user
    });
  }

});

router.put('/user/edit/:id', async (req, res) => {
    let user;
    try {
      user = await User.update({
        _id: req.param.id
    }, {
        $set: {
            isAdmin: req.body.isAdmin,
            'privileges.read': req.body.read,
            'privileges.create': req.body.create,
            'privileges.update': req.body.update,
            'privileges.delete': req.body.delete
        }
    });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong.',
        500
      );
      return next(error);
    }

    

    if (user) {
        //req.flash('success_msg', 'User account updated successfully.');
        res.redirect('/user');
    } 
});

router.get('/user/add', async (req, res, next) => {
  let result;
  try {
    console.log("here")
    result = await User.find({ 
      isRegistered: false
     });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500
    );
    return next(error);
}
  if (result.length === 0) {
    res.status(404).json({
      message: "User is not registered not found"
    })
  } else {
    const users = [];
    result.forEach(user => {
      // if user.name.includes ignore case
        const userObj = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
        users.push(userObj);
      
    }
    )
    res.status(200).json({
      users
    })
  }
})
router.get('/user/add/name=:name', async (req, res, next) => {
  const name = req.params.name;

  let result;
  try {
    console.log("here")
    result = await User.find({ "name": { "$regex": name, "$options": "i" } ,      
                                isRegistered: false
  });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500
    );
    return next(error);
}
  if (result.length === 0) {
    res.status(404).json({
      message: "User is not registered not found"
    })
  } else {
    const users = [];
    result.forEach(user => {
      // if user.name.includes ignore case
        const userObj = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
        users.push(userObj);
      
    }
    )
    res.status(200).json({
      users
    })
  }
})
router.post('/user/add/id=:id', async (req, res, next) => {
  let user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    else {
      try{
        user =  await User.updateOne(
          {_id: req.params.id} ,
           { $set: { 
              isStudent: req.body.isStudent,
              isLecturer: req.body.isLecturer,
              isPersonnel: req.body.isPersonnel,
              isRegistered: true
            }
       });
       user = await User.findOne({_id: req.params.id})
       console.log(user.isStudent)
      }catch (err) {
          const error = new HttpError(
            'Something went wrong .',
            500
          );
          return next(error);
      }
      res.status(200).json({
        id:null,
        isStudent: user.isStudent,
        isLecturer: user.isLecturer,
        isPersonnel: user.isPersonnel
      });
  }
});

router.get('/user/getId/id=:id', async (req, res, next) => {
  let user;
  let student;
  let lecturer;
  let personnel;
  try{
    user =  await User.findOne(
      {_id: req.params.id});

      if(user.isRegistered === false ){
        const error = new HttpError(
          'User is not registered .',
          500
        );
        res.redirect('user/add/id='+user._id);
      }
      
      if(user.isStudent){
        student = await Student.findOne({user: user._id})
        if(student){
          res.json({
            id: student._id,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel
          });
        }
        else {
          res.json({
            id:null,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel,
            message: "User is not registered"
          });
        }
      }
      else if(user.isLecturer){
        lecturer = await Lecturer.findOne({user: user._id})
        if(lecturer){
          res.json({
            id: lecturer._id,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel
          });
        }
        else {
          res.json({
            id:null,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel,
            message: "User is not registered"
          });
        }
      }
      else if(user.isPersonnel){
        personnel = await Personnel.findOne({user: user._id})
        if(personnel){
          res.json({
            id: personnel._id,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel
          });
        }
        else {
          res.json({
            id:null,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel,
            message: "User is not registered"
          });
        }
      }
      else {
        res.json({
          id:null,
          isStudent: user.isStudent,
          isLecturer: user.isLecturer,
          isPersonnel: user.isPersonnel,
          message: "User is not registered"
        });
      }
  
   
  }catch (err) {
      const error = new HttpError(
        'Something went wrong .',
        500
      );
      return next(error);
  }
      
  
});
router.get('/user/getId/email=:email', async (req, res, next) => {
  let user;
  let student;
  let lecturer;
  let personnel;

  try{
    user =  await User.findOne(
      {email: req.params.email});

      if(user.isRegistered === false ){
        const error = new HttpError(
          'User is not registered .',
          500
        );
        res.redirect('user/add/id='+user._id);
      }
      
      if(user.isStudent){
        student = await Student.findOne({user: user._id})
        if(student){
          res.json({
            id: student._id,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel
          });
        }
        else {
          res.json({
            id:null,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel,
            message: "User is not registered"
          });
        }
      }
      else if(user.isLecturer){
        lecturer = await Lecturer.findOne({user: user._id})
        if(lecturer){
          res.json({
            id: lecturer._id,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel
          });
        }
        else {
          res.json({
            id:null,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel,
            message: "User is not registered"
          });
        }
      }
      else if(user.isPersonnel){
        personnel = await Personnel.findOne({user: user._id})
        if(personnel){
          res.json({
            id: personnel._id,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel
          });
        }
        else {
          res.json({
            id:null,
            isStudent: user.isStudent,
            isLecturer: user.isLecturer,
            isPersonnel: user.isPersonnel,
            message: "User is not registered"
          });
        }
      }
      else {
        res.json({
          id:null,
          isStudent: user.isStudent,
          isLecturer: user.isLecturer,
          isPersonnel: user.isPersonnel,
          message: "User is not registered"
        });
      }
   
  }catch (err) {
      const error = new HttpError(
        'Something went wrong .',
        500
      );
      return next(error);
  }
});

module.exports = router;