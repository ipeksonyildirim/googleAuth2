const express = require('express')
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth')
// @desc Login/Landing page
//@route GET /
router.get('/',ensureGuest,(req, res) => {
        res.send('<a href="/auth/google"> Authenticate with Google </a>');
});
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}
// @desc dashboard
//@route GET /protected
router.get('/protected', ensureAuth,(req, res) => {
    res.send(`Hello ${req.user}`);
});

// @desc Logout
//@route GET /logout
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye');
})

module.exports = router; 