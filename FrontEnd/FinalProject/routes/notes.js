var express = require('express');
var router = express.Router();
var Note = require('../models/note');

//INDEX - Show all the notes
router.get("/", function (req, res) {
    Note.find({}, function (err, allNotes) {
        if (err) {
            console.log(err);
        } else {
            res.render("notes/index", { notes: allNotes });
        }
    });
});

//SHOW - Show page of each note, show more info about that note
router.get("/:id", function(req, res){
    //Find note with provided ID
    Note.findById(req.params.id, function(err, foundNote){
        if(err){
            console.log(err);
        } else{
            // Render show template
            res.render("../views/notes/show", {note: foundNote});
        }
    });
});

//NEW - Show form to create a new note
router.get("/new", function (req, res) {
    res.render("notes/new")
});

//CREATE - Add new note to the DB
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

//
module.exports = router;