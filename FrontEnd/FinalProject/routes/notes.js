var express = require('express');
var router = express.Router();
var Note = require('../models/note');

router.get("/", function (req, res) {
    Note.find({}, function (err, allNotes) {
        if (err) {
            console.log(err);
        } else {
            res.render("notes/index", { notes: allNotes });
        }
    });
});

router.get("/new", function (req, res) {
    res.render("notes/new")
});

router.post("/new", function (req, res) {
    var note = req.body.note;

    var newNote = { title: note.title, content: note.content };

    Note.create(newNote, function (err, newlyNote) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to notes page
            console.log(newlyNote);
            res.redirect("/notes");
        }
    });

});

module.exports = router;