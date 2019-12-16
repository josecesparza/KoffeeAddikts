//Require the needed packages
var express = require('express');
//Merge params from the notes and comments together
var router = express.Router({ mergeParams: true });
//Require note and comment model to do the queries in the database
var Note = require('../models/note');
var Comment = require('../models/comment');
var User = require('../models/user');

// Get route to create the new comment in a specific coffee
router.get("/new", middlewareObj.isLoggedIn, async function (req, res) {
    const session = await User.startSession();
    session.startTransaction();
    try {
        //Find specific coffee to add the new comment
        Note.findById(req.params.id, function (err, note) {
            if (err) {
                console.log(err);
            } else {
                console.log(note);
                //Render new comment template for that coffee
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

//Post route to add the new comment
router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    //Lookup coffee using ID
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

                    //Connect new comment to coffee
                    note.comments.push(comment);
                    note.save();

                    req.flash("success", "Comment created successfully");
                    //Redirect to coffee show page
                    res.redirect("/notes/" + note._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function (req, res) {
    //Find the comment to edit
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            //Render the edit comment template
            res.render("comments/edit", { note_id: req.params.id, comment: foundComment });

        }
    });

});

//UPDATE ROUTE
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    //Find the comment to update
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            //Success pop up
            req.flash("success", "Comment updated successfully");
            res.redirect("/notes/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    //Find the comment to delete
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            //Success pop up
            req.flash("success", "Comment deleted successfully");
            res.redirect("/notes/" + req.params.id);
        }
    });
});
//We export the router, it contains all our routes
module.exports = router;