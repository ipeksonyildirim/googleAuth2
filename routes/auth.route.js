const express = require('express')
const passport = require('passport')
const router = express.Router();
const authController = require('../controllers/auth.controller');


/*router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
*/




// @desc Auth with Google
//@route GET /auth/google
router.get('/google', authController.getAuthGoogle);
// router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))


// @desc Google Auth callback
//@route GET /auth/google/callback
router.get('/google/callback', authController.getAuthGoogleCallback);

/*
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
      res.redirect('/dashboard')
    }
);
*/
// @desc failure on authentication with Google
//@route GET /auth/failure
router.get('/failure', authController.getAuthFailure);

/*
router.get('/failure', (req, res) => {
    res.send('something went wrong..');
});
*/
module.exports = router;