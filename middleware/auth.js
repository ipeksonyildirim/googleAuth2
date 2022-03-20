const User = require('../models/user.model')
const HttpError = require('../models/http-error.model');

  module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'You must login first');
        res.redirect('/');
    },
    isAdmin: async (req, res, next) => {
      try {
      let id = req.user
      const user1 =  await (await User.find({ _id: id }).lean()).at(0)

      if (user1.isAdmin == true) {

          return next();
      }
      } catch (err) {
        const error = new HttpError(
            'Fetching admin failed, please try again later.',
            500
          );
          return next(error);
      }
   
      const error = new HttpError(
        'The request was valid, but the server is refusing action. This happened may be because you might not have the necessary permissions for this resource, or this resource may need an account of some sort.',
       403
      );
      return next(error);
    },
    isLoggedIn: function (req, res, next) {
        if (!(req.isAuthenticated())) {
            return next();
        }

        req.flash('error_msg', 'You are already signed in.');
        res.redirect('/dashboard');
    },
    readAccessControl: function (req, res, next) {
        if (req.user.privileges.read == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/');
    },
    createAccessControl: function (req, res, next) {
        if (req.user.privileges.create == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/');
    },
    updateAccessControl: function (req, res, next) {
        if (req.user.privileges.update == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/');
    },
    deleteAccessControl: function (req, res, next) {
        if (req.user.privileges.delete == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/');
    }
}
