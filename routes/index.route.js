const express = require('express')
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const indexController = require('../controllers/index.controller');

// @desc Login/Landing page
//@route GET /

//const Student = require('../models/student.model')

router.get('/',ensureGuest, indexController.getLogin);

// @desc dashboard
//@route GET /protected
router.get('/dashboard',ensureAuth, indexController.getDashboard);

/*
router.get('/dashboard', ensureAuth,(req, res) => {
  /*
    try {
        const students = await Student.find({ user: req.user.id }).lean()
        res.render('dashboard', {
          name: req.user.firstName,
          students,
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      }
      
      res.send(`Hello ${req.user}`);
});
*/
// @desc Logout
//@route GET /logout
router.get('/logout',ensureAuth, indexController.getLogout);
/*

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye');
})
*/
module.exports = router; 