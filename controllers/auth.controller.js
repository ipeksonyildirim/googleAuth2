const express = require('express')
const passport = require('passport')

const getAuthGoogle = async (req, res, next) => {
    try {
        passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);

    } catch (error) {
        return next(error);
    }
};

const getAuthGoogleCallback = async (req, res, next) => {
    try {
        passport.authenticate('google', { successRedirect:'/dashboard', failureRedirect: '/auth/failure' })(req, res,next)
    } catch (error) {
        return next(error);
    }
};

const getAuthFailure = async (req, res, next) => {
    try {
        res.json('something went wrong..');
    } catch (error) {
        return next(error);
    }
};

exports.getAuthGoogle = getAuthGoogle;
exports.getAuthGoogleCallback = getAuthGoogleCallback;
exports.getAuthFailure = getAuthFailure;
