const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');

router.get("/", function(req, res){
    res.render("landing");
});

// AuthRoutes
router.get('/register', (req, res) => {
    res.render('register');
});
// handel signup logic
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });

    });
});
// login 
router.get('/login', (req, res) => {
    res.render('login')
});
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {

});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});
function isLoggedin(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
module.exports = router;