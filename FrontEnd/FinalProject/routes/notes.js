var express = require('express');
var router = express.Router();
var Note = require('../models/note');
var middleware = require('../middleware/index');

//INDEX - Show all the notes
router.get("/", function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Note.find({ name: regex }, function (err, regexNotes) {
            if (err) {
                console.log(err);
            } else {
                res.render("notes/index", { notes: regexNotes });
            }
        });
    } else {
        Note.find({}, function (err, allNotes) {
            if (err) {
                console.log(err);
            } else {
                res.render("notes/index", { notes: allNotes });
            }
        });
    }
});

//NEW - Show form to create a new note
router.get("/new", middleware.isBusiness, function (req, res) {
    res.render("notes/new")
});

//SHOW - Show page of each note, show more info about that note
router.get("/:id", function (req, res) {
    //Find note with provided ID
    Note.findById(req.params.id).populate("comments").exec(function (err, foundNote) {
        if (err) {
            console.log(err);
        } else {
            // Render show template
            res.render("../views/notes/show", { note: foundNote });
        }
    });
});

//EDIT - Show form to edit the note
router.get("/:id/edit", middleware.checkNoteOwnership, function (req, res) {
    Note.findById(req.params.id, function (err, foundNote) {
        if (err) {
            console.log(err);
        } else {
            //Render edit template
            res.render("../views/notes/edit", { note: foundNote });
        }
    });
});

//UPDATE - Update the edited note in the DB
router.put("/:id", middleware.checkNoteOwnership, function (req, res) {
    Note.findByIdAndUpdate(req.params.id, req.body.note, function (err, updatedNote) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/notes/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkNoteOwnership, function (req, res) {
    Note.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/notes");
        }
    });
});

//CREATE - Add new note to the DB
router.post("/new", middleware.isBusiness, function (req, res) {
    var note = req.body.note;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var location = {
        lat: note.lat,
        lng: note.lng
    }

    var newNote = { name: note.name, content: note.content, author: author, location: location };

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
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;