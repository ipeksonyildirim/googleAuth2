const User = require('../models/user.model');
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

module.exports = {
  ensureAuthenticated,
  isAdmin,
  isLoggedIn,
  readAccessControl,
  createAccessControl,
  updateAccessControl,
  deleteAccessControl,
};
