const express = require('express')
const router = express.Router();
const User = require('../models/user.model')
const HttpError = require('../models/http-error.model');
const passport = require('passport');
const { validationResult } = require('express-validator');

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
    res.json(`hello  ${user1.displayName}`)
  } catch (err) {
    const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
  }
});

// @desc Logout
//@route GET /logout

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye');
})

// Protected Routes.

router.get('/user', [ensureAuthenticated, isAdmin], async (req, res, next) => {
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
  return res.json({users: users.map(user => user.toObject({ getters: true }))});
   
});
router.get('/user/:id', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res, next) => {
  let users;
  try {
    users = await User.find({_id: req.params.id});
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  return res.json({users: users.map(user => user.toObject({ getters: true }))});
   
});
router.delete('/user/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await User.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/users');
    }
});




// Edit User Account.

router.get('/user/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    const result = await User.findOne({
        _id: req.params.id
    }).select({
        isAdmin: 1,
        privileges: 1
    });

    if (result) {
        res.send(result);
    } else {
        res.status(400).send('Resource not found...');
    }
});

router.put('/user/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    const result = await User.update({
        _id: req.params.id
    }, {
        $set: {
            isAdmin: req.body.isAdmin,
            'privileges.read': req.body.read,
            'privileges.create': req.body.create,
            'privileges.update': req.body.update,
            'privileges.delete': req.body.delete
        }
    });

    if (result) {
        req.flash('success_msg', 'User account updated successfully.');
        res.json('/users');
    } else {
        req.flash('error_msg', 'Error creating user.');
        res.status(500).json('/users');
    }
});

module.exports = router;