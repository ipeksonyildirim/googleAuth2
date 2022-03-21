const User = require('../models/user.model');
const Student = require('../models/student.model');
const Lecturer = require('../models/lecturer.model');
const Post = require('../models/post.model');
const Course = require('../models/course.model');

const HttpError = require('../models/http-error.model');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  // TODO handle error
  // req.flash('error_msg', 'You must login first');
  res.redirect('/');
};

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user;
    const user1 = await (await User.find({ _id: id }).lean()).at(0);

    if (user1.isAdmin === true) {
      next();
      return;
    }
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500,
    );
    next(error);
    return;
  }

  const error = new HttpError(
    'The request was valid, but the server is refusing action. This happened may be because you might not have the necessary permissions for this resource, or this resource may need an account of some sort.',
    403,
  );
  next(error);
};

const isLoggedIn = (req, res, next) => {
  if (!(req.isAuthenticated())) {
    next();
    return;
  }
  // TODO handle error
  res.redirect('/dashboard');
};

const readAccessControl = (req, res, next) => {
  if (req.user.privileges.read === true) {
    next();
    return;
  }
  // TODO handle error
  res.redirect('/');
};

const createAccessControl = (req, res, next) => {
  if (req.user.privileges.create === true) {
    next();
    return;
  }
  // TODO handle error
  // req.flash('error_msg', 'You do not have the required permissions to perform this action.');
  res.redirect('/');
};

const updateAccessControl = (req, res, next) => {
  if (req.user.privileges.update === true) {
    next();
    return;
  }
  // TODO handle error
  // req.flash('error_msg', 'You do not have the required permissions to perform this action.');
  res.redirect('/');
};

const deleteAccessControl = (req, res, next) => {
  if (req.user.privileges.delete === true) {
    next();
    return;
  }
  // TODO handle error
  // req.flash('error_msg', 'You do not have the required permissions to perform this action.');
  res.redirect('/');
};


const inCourse = async(req, res, next) => {


  let student;
  let lecturer;
  try {
      student = await Student.findOne({
          user: req.user
      });
    } catch (err) {
      const error = new HttpError(
        'Fetching student failed, please try again later.',
        500
      );
      return next(error);
    }
    try {
      lecturer = await Lecturer.findOne({
          user: req.user
      });
    } catch (err) {
      const error = new HttpError(
        'Fetching lecturer failed, please try again later.',
        500
      );
      return next(error);
    }
  let course;
  if (student) {
    try {
      course = await Course.findOne({
        _id: req.body.course,
        students: { "$in" : [student]} });
    } catch (err) {
      const error = new HttpError('Failed, please try again', 500);
      return next(error);
    }
    if (course) {
      next();
      return;    
    }

   
    }

    else if (lecturer) {
      try {
        course = await Course.findOne({
          _id: req.body.course,
          lecturers: { "$in" : [lecturer]} });
      } catch (err) {
        const error = new HttpError('Failed, please try again', 500);
        return next(error);
      }
      if (course) {
        next();
        return;    
      }
    }
  // TODO handle error
  // req.flash('error_msg', 'You do not have the required permissions to perform this action.');
  res.redirect('/');
};

const isOwner = async(req, res, next) => {

  let post;
  try {
      post = await Post.findOne({
          _id: req.params.id
      });
  } catch (err) {
      const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
  }
  if(post){
    if(post.user === req.user){
      next();
      return;
    }
    
  }
  // TODO handle error
  // req.flash('error_msg', 'You do not have the required permissions to perform this action.');
  res.redirect('/');
};


module.exports = {
  ensureAuthenticated,
  isAdmin,
  isLoggedIn,
  readAccessControl,
  createAccessControl,
  updateAccessControl,
  deleteAccessControl,
  inCourse,
  isOwner
};
