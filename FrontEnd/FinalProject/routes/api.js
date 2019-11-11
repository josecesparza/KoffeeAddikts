var express = require('express');
var router = express.Router();
var Note = require('../models/note');
var User = require('../models/user');
var Comment = require('../models/comment');

//Creation of the API
router.get("/", function (req, res) {
    //Explanation how to use this API
    res.render("api");
});

router.get("/note", function (req, res) {
    Note.find({ "public": true }, function (err, allNotes) {
        res.json(allNotes);
    });
});

router.get("/note/:note_id", function (req, res) {
    Note.findById(req.params.note_id).populate("comments").exec(function (err, foundNote) {
        if (err) {
            console.log(err);
        } else {
            // Render show template
            if (!foundNote.public) {
                res.send("This data is private, sorry!");
            } else {
                res.json(foundNote);
            }

        }
    });
});

router.get("/comment/:comment_id", function (req, res) {
    //We have to do a query in the DB
    Comment.findById( req.params.comment_id, function (err, foundComment) {
        res.json(foundComment);
    });
});

router.get("/user", function (req, res) {
    //We have to do a query in the DB
    User.find({ }, function (err, allUsers) {
        res.json(allUsers);
    });
});

router.get("/user/:user_id", function (req, res) {
    //We have to do a query in the DB
    User.findById( req.params.user_id, function (err, foundUser) {
        res.json(foundUser);
    });
});

module.exports = router;