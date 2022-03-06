
const express = require('express')
const passport = require('passport')
const HttpError = require('../models/http-error.model');

const Student = require('../models/student.model')
const User = require('../models/user.model')

const getLogin = async (req, res, next) => {
    try {
        return res.send('<a href="/auth/google"> Authenticate with Google </a>');

    } catch (error) {
        return next(error);
    }
};

const getDashboard = async (req, res, next) => {
    try {
        const user1 = await (await User.find({ _id: req.session.passport.user }).lean()).at(0)
        //res.json({student: student.map(student => student.toObject({ getters: true }))});
        console.log(user1.displayName)
        res.json(`hello  ${user1.displayName}`)
        /*res.render('dashboard', {
          name: req.user.firstName,
          students,
        })*/
      } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
          );
          return next(error);
      }
};

const getLogout = async (req, res, next) => {
    try {
        req.logout();
        req.session.destroy();
        res.json('Goodbye');
    } catch (error) {
        return next(error);
    }
};

exports.getLogin = getLogin;
exports.getDashboard = getDashboard;
exports.getLogout = getLogout;
