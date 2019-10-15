var Note = require('../models/note');
var Comment = require('../models/comment');
var User = require('../models/user');

middlewareObj = {};

//Protect note routes
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

//Protect comment routes
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

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/login");
};

middlewareObj.isBusiness = function isBusiness(req, res, next) {
    if (req.isAuthenticated() && req.user.isBusiness === true) {
        return next();
    }
    res.redirect("/user/login");
}


module.exports = middlewareObj;