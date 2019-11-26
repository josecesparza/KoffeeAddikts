//Require the needed packages
var express = require('express');
//Merge params from the notes and comments together
var router = express.Router({ mergeParams: true });
//Require note and comment model to do the queries in the database
var Note = require('../models/note');
var Comment = require('../models/comment');
var User = require('../models/user');

router.get("/new", middlewareObj.isLoggedIn, async function (req, res) {
    const session = await User.startSession();
    session.startTransaction();
    try {
        Note.findById(req.params.id, function (err, note) {
            if (err) {
                console.log(err);
            } else {
                console.log(note);
                //Render new comment template for that campground
                res.render("comments/new", { note: note });
            }
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

router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    //Lookup note using ID
    Note.findById(req.params.id, function (err, note) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/notes");
        } else {
            //Create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                    res.redirect("/notes");
                } else {
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //Save comment
                    comment.save();

                    //Connect new comment to campground
                    note.comments.push(comment);
                    note.save();

                    req.flash("success", "Comment created successfully");
                    //Redirect to campground show page
                    res.redirect("/notes/" + note._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { note_id: req.params.id, comment: foundComment });

        }
    });

});

//UPDATE ROUTE
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated successfully");
            res.redirect("/notes/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully");
            res.redirect("/notes/" + req.params.id);
        }
    });
});

module.exports = router;