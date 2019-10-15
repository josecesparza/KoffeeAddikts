var express = require('express');
var router = express.Router({ mergeParams: true }); //Merge params from the notes and comments together
var Note = require('../models/note');
var Comment = require('../models/comment');
var middleware = require('../middleware/index');


router.get("/new", middleware.isLoggedIn,function (req, res) {
    Note.findById(req.params.id, function (err, note) {
        if (err) {
            console.log(err);
        } else {
            console.log(note);
            //Render new comment template for that campground
            res.render("comments/new", { note: note });
        }
    });
});

router.post("/", middleware.isLoggedIn,function (req, res) {
    //Lookup note using ID
    Note.findById(req.params.id, function (err, note) {
        if (err) {
            console.log(err);
            res.redirect("/notes");
        } else {
            //Create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
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

                    //Redirect to campground show page
                    res.redirect("/notes/" + note._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit",  middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { note_id: req.params.id, comment: foundComment });

        }
    });

});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/notes/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/notes/" + req.params.id);
        }
    });
});

module.exports = router;