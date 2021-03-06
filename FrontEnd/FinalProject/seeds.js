var mongoose = require('mongoose');
var Note = require('./models/note');
var User = require('./models/user');
var Comment = require('./models/comment');

var newUser = new User({
    username: "starcoffee",
    name: "starcoffee and co",
    email: "info@starcoffee.com",
    isBusiness: true
});

var newUserPass = "starcoffee";

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
                            name: "CappuccinoK",
                            kind: "Cappuccino",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat sem eget tellus viverra maximus.",
                            author: {
                                id: newlyUser._id,
                                username: newlyUser.username
                            },
                            location:{
                                lat: "39.2801",
                                lng: "-0.2238"
                            },
                            price: "250",
                            public: true
                        },
                        {
                            name: "LatteK",
                            kind: "Latte",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat sem eget tellus viverra maximus.",
                            author: {
                                id: newlyUser._id,
                                username: newlyUser.username
                            },
                            location:{
                                lat: "38.8218912",
                                lng: "-0.606323"
                            },
                            price: "205",
                            public: true
                        },
                        {
                            name: "EspressoK",
                            kind: "Espresso",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat sem eget tellus viverra maximus.",
                            author: {
                                id: newlyUser._id,
                                username: newlyUser.username
                            },
                            location:{
                                lat: "38.8218912",
                                lng: "-0.606323"
                            },
                            price: "225",
                            public: true
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
                                    console.log("New coffee created: " + newlyNote.name);

                                    //REMOVE COMMENTS
                                    Comment.remove({}, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log("Comment removed");

                                        Comment.create({
                                            text: "Amazing coffee, you should try it",
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