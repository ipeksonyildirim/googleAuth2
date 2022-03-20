const express = require('express');
const passport = require('passport');

const router = express.Router();

// @desc Auth with Google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// @desc Google Auth callback
// @route GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/dashboard');
  },
);

// @desc failure on authentication with Google
// @route GET /auth/failure

router.get('/failure', (req, res) => {
  res.send('something went wrong..');
});

module.exports = router;
