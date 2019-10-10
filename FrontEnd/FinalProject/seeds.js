var mongoose = require('mongoose');
var Note = require('./models/note');
var User = require('./models/user');
var Comment = require('./models/comment');

var newUser = new User({
    username: "test"
});

var newUserPass = "test";

function seedDB() {
    console.log("Seed Function ON!");

    //REMOVE USERS
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Users've been removed from the database");
            User.register(newUser, newUserPass, function (err, newlyUser) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Created New User: " + newlyUser.username);

                    var notesData = [
                        {
                            title: "Note 1",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat sem eget tellus viverra maximus.",
                            author: {
                                id: newlyUser._id,
                                username: newlyUser.username
                            }
                        },
                        {
                            title: "Note 2",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat sem eget tellus viverra maximus.",
                            author: {
                                id: newlyUser._id,
                                username: newlyUser.username
                            }
                        },
                        {
                            title: "Note 3",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat sem eget tellus viverra maximus.",
                            author: {
                                id: newlyUser._id,
                                username: newlyUser.username
                            }
                        }
                    ];

                    //REMOVE NOTES
                    Note.remove({}, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Notes've been removed from the database");
                        notesData.forEach(function (seed) {
                            Note.create(seed, function (err, newlyNote) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("New note created: " + newlyNote.title);

                                    //REMOVE COMMENTS
                                    Comment.remove({}, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log("Comment removed");

                                        Comment.create({
                                            text: "Good Note XD",
                                            author: {
                                                id: newlyUser._id,
                                                username: newlyUser.username
                                            }
                                        }, function (err, newlyComment) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    //Add a few comments
                                                    newlyNote.comments.push(newlyComment);
                                                    newlyNote.save();
                                                    console.log("Created new comment");
                                                }
                                            }
                                        })
                                    });
                                }
                            });
                        });
                    });
                }
            });
        }
    });
};

module.exports = seedDB;