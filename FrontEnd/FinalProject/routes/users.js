//Require the needed packages
var express = require('express');
var router = express.Router();
var passport = require('passport');
//Require note and user model to do the queries in the database
var User = require('../models/user');
var Note = require('../models/note');

//Show register form
router.get("/register", function (req, res) {
    res.render("users/register");
});

//Handling sign up logic 
router.post("/register", async function (req, res) {
    //Defining new user info
    var newUser = new User({ username: req.body.username, name: req.body.name, email: req.body.email });
    //Checking the business code
    if (req.body.businessCode === "secretcode123") {
        newUser.isBusiness = true;
    }

    const session = await User.startSession();
    session.startTransaction();
    try {
        //Creating new user
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            }

            //Logging in a session with the new user
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome " + newUser.username + " !");
                res.redirect("/notes");
            });
        });
        await session.commitTransaction();
        session.endSession();
        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
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
    //Finding user to show by id
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash("error", "This user doesn't exist");
        } else {
            Note.find({ "author.id": req.params.id }, function (err, authorNotes) {
                if (err) {
                    console.log(err);
                } else {
                    //Rendering show template for the specific user
                    res.render('../views/users/show', { foundUser: foundUser, notes: authorNotes });
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middlewareObj.checkUserOwnership, function (req, res) {
    //Finding user to edit by id
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            res.redirect("back");
        } else {
            //Rendering edit template for the specific user
            res.render('users/edit', { foundUser: foundUser });
        }
    });
});

//UPDATE ROUTE
router.put("/:id", middlewareObj.checkUserOwnership, function (req, res) {
    //Finding user to update by id
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
    //Finding user to delete by id
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

//Follow user route
router.post("/:id/follow-user", middlewareObj.isLoggedIn, function (req, res) {
    // check if the requested user and :user_id is same if same then 
    if (req.user.id === req.params.id) {
        req.flash("error", "You cannot follow yourself!");
        res.redirect("/user/" + req.user.id);
        return;
    }

    //Geting the logged user
    User.findById(req.params.id)
        .then(user => {
            // check if the requested user is already in follower list of other user then 
            if (user.followers.filter(follower =>
                follower.user.toString() === req.user.id).length > 0) {
                req.flash("error", "You already followed the user");
                return res.redirect("/user/" + req.params.id);
            }
            user.followers.unshift({ user: req.user.id });
            user.save()
            //Looking the user to follow by id
            User.findOne({ email: req.user.email })
                .then(user => {
                    user.following.unshift({ user: req.params.id });
                    //Save user to the following user
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
//We export the router, it contains all our routes
module.exports = router;