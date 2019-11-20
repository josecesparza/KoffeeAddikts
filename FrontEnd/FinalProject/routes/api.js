//Require the needed packages
var express = require('express');
var router = express.Router();
//Require all the models to do the queries in the database
var Note = require('../models/note');
var User = require('../models/user');
var Comment = require('../models/comment');

//Creation of the API
//All this routes have as a prefix /api
//This route will be the main page of our API
router.get("/", function (req, res) {
    //Render api.ejs
    res.render("api");
});

//Define /note route to get all public notes
router.get("/note", function (req, res) {
    //Get in the database all the public notes
    Note.find({ "public": true }, function (err, allNotes) {
        //Render all the notes in JSON format
        res.json(allNotes);
    });
});

//Define route to get a specific note
router.get("/note/:note_id", function (req, res) {
    //Get the note by ID will all the comments
    Note.findById(req.params.note_id).populate("comments").exec(function (err, foundNote) {
        if (err) {
            console.log(err);
        } else {
            // Check if the found note is public
            if (!foundNote.public) {
                //If it's not public render a page with the following string
                res.send("This data is private, sorry!");
            } else {
                //Render the found note in JSON format
                res.json(foundNote);
            }

        }
    });
});

//Define route to get a specific comment
router.get("/comment/:comment_id", function (req, res) {
    //Get the comment by ID
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        //Render the found comment in JSON format
        res.json(foundComment);
    });
});

//Define route to get all the users
//Obviously we are not showing the hashed password and the salt value
router.get("/user", function (req, res) {
    //Get all the users in the database, the query is empty because we don't need parameters
    User.find({}, function (err, allUsers) {
        //Render all the users in JSON format
        res.json(allUsers);
    });
});

//Define route to get an specific user
router.get("/user/:user_id", function (req, res) {
    //Get the user by ID
    User.findById(req.params.user_id, function (err, foundUser) {
        //Render the found user in JSON format
        res.json(foundUser);
    });
});

//We export the router, it contains all our routes
module.exports = router;