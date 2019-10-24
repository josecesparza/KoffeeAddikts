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
    var newUser = new User({ username: req.body.username, name: req.body.name, email: req.body.email });
    if (req.body.businessCode === "secretcode123") {
        newUser.isBusiness = true;
    }

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            return res.render("users/register");
        }

        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome " + newUser.username + " !");
            res.redirect("/notes");
        });

    });
});

//LOGIN FORM
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
    req.flash("success", "Logged you out!");
    res.redirect("/notes");
});

//SHOW ROUTE
router.get("/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash("error", "This user doesn't exist");
        } else {
            res.render('../views/users/show', { foundUser: foundUser });
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middlewareObj.checkUserOwnership, function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            res.redirect("back");
        } else {
            res.render('users/edit', { foundUser: foundUser });
        }
    });
});

//UPDATE ROUTE
router.put("/:id", middlewareObj.checkUserOwnership, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "User updated successfully");
            res.redirect("/user/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middlewareObj.checkUserOwnership, function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "User deleted successfully!");
            res.redirect("/notes");
        }
    });
});

//TEST
router.post("/:id/follow-user", middlewareObj.isLoggedIn, function (req, res) {

    // check if the requested user and :user_id is same if same then 
    if (req.user.id === req.params.id) {
        req.flash("error", "You cannot follow yourself!");
        res.redirect("/user/" + req.user.id);
        return;
        // return res.status(400).json({ alreadyfollow: "You cannot follow yourself" })
    }
    
    User.findById(req.params.id)
        .then(user => {
            // check if the requested user is already in follower list of other user then 
            if (user.followers.filter(follower =>
                follower.user.toString() === req.user.id).length > 0) {
                req.flash("error", "You already followed the user");
                return res.redirect("/user/" + req.params.id);
                // return res.status(400).json({ alreadyfollow: "You already followed the user" })
            }
            user.followers.unshift({ user: req.user.id });
            user.save()
            User.findOne({ email: req.user.email })
                .then(user => {
                   
                    user.following.unshift({ user: req.params.id });
                    user.save().then(user => {
                        req.flash("success", "Following!");
                        res.redirect("/user/" + req.params.id);
                        return;
                    }
                    )
                })
                .catch(err => res.status(404).json({ alradyfollow: "you already followed the user" }))
        })
});

module.exports = router;
