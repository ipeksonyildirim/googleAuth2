const express = require('express')
const passport = require('passport')

const getAuthGoggle = async (req, res, next) => {
    try {
        passport.authenticate('google', { scope: ['email', 'profile'] })

    } catch (error) {
        return next(error);
    }
};

const getAuthGoggleCallback = async (req, res, next) => {
    try {
        passport.authenticate('google', { failureRedirect: '/auth/failure' }),
        (req, res) => {
          res.redirect('/dashboard')
        }
    } catch (error) {
        return next(error);
    }
};

const getAuthFailure = async (req, res, next) => {
    try {
        res.send('something went wrong..');
    } catch (error) {
        return next(error);
    }
};

exports.getAuthGoggle = getAuthGoggle;
exports.getAuthGoggleCallback = getAuthGoggleCallback;
exports.getAuthFailure = getAuthFailure;
