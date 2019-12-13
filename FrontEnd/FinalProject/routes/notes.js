var express = require('express');
var router = express.Router();
var Note = require('../models/note');
var User = require('../models/user');

var middlewareObj = require('../middleware/index');

var mongoose = require('mongoose');
var crypto = require('crypto');
var path = require('path');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
// DB
const mongoURI = "mongodb://localhost:27017/notes_app";

// connection
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// init gfs
let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});

//INDEX - Show all the notes
router.get("/", function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Note.find({ $or: [{ name: regex }, { kind: regex }], "public": true }, function (err, regexNotes) {
            if (err) {
                console.log(err);
            } else {
                res.render("notes/index", { notes: regexNotes });
            }
        });
    } else {
        Note.find({ "public": true }, function (err, allNotes) {
            if (err) {
                console.log(err);
            } else {
                res.render("notes/index", { notes: allNotes });
            }
        });
    }
});

//NEW - Show form to create a new note
router.get("/new", middlewareObj.isBusiness, function (req, res) {
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
router.get("/:id/edit", middlewareObj.checkNoteOwnership, function (req, res) {
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
router.put("/:id", middlewareObj.checkNoteOwnership, async function (req, res) {
    if (req.body.note.public == "on") {
        req.body.note.public = true;
    } else {
        req.body.note.public = false;
    }

    const session = await User.startSession();
    session.startTransaction();
    try {
        Note.findByIdAndUpdate(req.params.id, req.body.note, function (err, updatedNote) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
            } else {
                req.flash("success", "Koffee updated successfully");
                res.redirect("/notes/" + req.params.id);
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

var FILES_COLL = "uploads.files";

//DESTROY ROUTE
router.delete("/:id", middlewareObj.checkNoteOwnership, function (req, res) {

    Note.findById(req.params.id, function (err, foundNote) {

        var imageId = foundNote.image.id;

        console.log("imageId" + imageId);
        gfs.delete(new mongoose.Types.ObjectId(imageId), (err, data) => {
            if (err){
                console.log(err)
            } 
            
            Note.findByIdAndRemove(req.params.id, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("success", "Koffee deleted successfully");
                    res.redirect("/notes");
                }
            });
        });


    });

});

router.get("/image/:filename", (req, res) => {
    const file = gfs
        .find({
            filename: req.params.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
});

//CREATE - Add new note to the DB
router.post("/new", upload.single("file"), function (req, res) {

    var note = req.body.note;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var location = {
        lat: note.lat,
        lng: note.lng
    }

    var image = {
        id: req.file.id,
        filename: req.file.filename
    }

    var newNote = { name: note.name, content: note.content, author: author, price: note.price, location: location, kind: note.kind, image: image };

    if (note.public == "on") {
        newNote.public = true;
    }

    Note.create(newNote, function (err, newlyNote) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to notes page
            req.flash("success", newNote.name + " created successfully");
            res.redirect("/notes");
        }
    });

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;