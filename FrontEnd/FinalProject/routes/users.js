var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//Show register form
router.get("/register", function (req, res) {
    res.render("users/register");
});

//Handling sign up logic 
router.post("/register", function (req, res) {
        var newUser = new User({ username: req.body.username });
        if (req.body.businessCode === "secretcode123") {
            newUser.isBusiness = true;
        }

        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                return res.render("users/register");
            }

            passport.authenticate("local")(req, res, function () {
                res.redirect("/notes");
            });

        });
});

//SHOW LOGIN FORM
router.get("/login", function (req, res) {
    res.render("users/login");
});

//Handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/notes",
        failureRedirect: "/user/login"
    }), function (req, res) {
    }
);

//logout route
router.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/notes");
});

module.exports = router;
