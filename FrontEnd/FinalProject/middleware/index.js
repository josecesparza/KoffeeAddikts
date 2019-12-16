//Require all the models to do the queries in the database
var Note = require('../models/note');
var Comment = require('../models/comment');
var User = require('../models/user');
//Declaring the middleware array
middlewareObj = {};

//Protect coffee routes, this middleware fucntion is checking the ownership of the coffee
middlewareObj.checkNoteOwnership = function checkNoteOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Note.findById(req.params.id, function (err, foundNote) {
            if (err || !foundNote) {
                res.redirect("/notes");
            } else {
                //Does user own the note?
                if (foundNote.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

//Protect comment routes, this middleware fucntion is checking the ownership of the comment
middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                res.redirect("/notes");
            } else {
                //Does user own the note?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

//Protect user routes, this middleware fucntion is checking the ownership of the user
middlewareObj.checkUserOwnership = function checkUserOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "Sorry, that user doesn't exist!");
                res.redirect("back");
            } else {
                //Does the current user own the user?
                if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("/notes");
                }
            }
        });
    } else {
        res.redirect("/notes");
    }
};

//This middleware function is checking if the user is logged with a valid account
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/login");
};

//This middleware function is checking if the user is logged with a business account
middlewareObj.isBusiness = function isBusiness(req, res, next) {
    if (req.isAuthenticated() && req.user.isBusiness === true) {
        return next();
    }
    res.redirect("/user/login");
}

//We export the middlewareObj, it contains all our middleware functions
module.exports = middlewareObj;