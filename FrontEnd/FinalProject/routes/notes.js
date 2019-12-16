//Require the needed packages
var express = require('express');
var router = express.Router();
//Require note and user model to do the queries in the database
var Note = require('../models/note');
var User = require('../models/user');
var middlewareObj = require('../middleware/index');

//Require the needed packages to save images in the database
var mongoose = require('mongoose');
var crypto = require('crypto');
var path = require('path');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
// Database URI connection to save images
const mongoURI = "mongodb+srv://developerjose:m0ng0DB!@cluster0-uce7k.mongodb.net/koffee_app?retryWrites=true&w=majority";

// connection to DB to save images
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Init gfs module
let gfs;
//Opening connection
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

// Declare storage URI and file
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

//Saving the storage in the upload variable via the multer module
const upload = multer({
    storage
});

//INDEX - Show all the notes
router.get("/", function (req, res) {
    //Checking if the user is using the searcher
    if (req.query.search) {
        //Declaring the regular expression of the search
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //Looking for coffees where the name or kind match with the regular expression
        Note.find({ $or: [{ name: regex }, { kind: regex }], "public": true }, function (err, regexNotes) {
            if (err) {
                console.log(err);
            } else {
                //Rendering the index template with the found coffees
                res.render("notes/index", { notes: regexNotes });
            }
        });
    } else {
        //If the user is not using the searcher engine we are gonna render the index coffee with all the public coffees
        Note.find({ "public": true }, function (err, allNotes) {
            if (err) {
                console.log(err);
            } else {
                res.render("notes/index", { notes: allNotes });
            }
        });
    }
});

//NEW - Show form to create a new coffee
router.get("/new", middlewareObj.isBusiness, function (req, res) {
    res.render("notes/new")
});

//SHOW - Show page of each coffee, show more info about that coffee
router.get("/:id", function (req, res) {
    //Find coffee with provided ID
    Note.findById(req.params.id).populate("comments").exec(function (err, foundNote) {
        if (err) {
            console.log(err);
        } else {
            // Render show template
            res.render("../views/notes/show", { note: foundNote });
        }
    });
});

//EDIT - Show form to edit the coffee
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

//UPDATE - Update the edited coffee in the DB
router.put("/:id", middlewareObj.checkNoteOwnership, async function (req, res) {
    //Checking if the coffee is public or not
    if (req.body.note.public == "on") {
        req.body.note.public = true;
    } else {
        req.body.note.public = false;
    }

    const session = await User.startSession();
    session.startTransaction();
    try {
        //Looking for the coffee to update by ID
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


//DESTROY ROUTE
router.delete("/:id", middlewareObj.checkNoteOwnership, function (req, res) {
    //Looking for the coffee to delete by ID
    Note.findById(req.params.id, function (err, foundNote) {

        var imageId = foundNote.image.id;

        //Looking for the image of the specific coffee to delete by image_id
        gfs.delete(new mongoose.Types.ObjectId(imageId), (err, data) => {
            if (err) {
                console.log(err)
            }
            //Delete the specific coffee
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

//Get route for the uploaded images
router.get("/image/:filename", (req, res) => {
    const file = gfs
        //Getting the image by the filename
        .find({
            filename: req.params.filename
        })
        //Getting the image in an json array
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
});

//CREATE - Add new coffee to the DB
router.post("/new", upload.single("file"), function (req, res) {
    //Checking if the user is logged in and with a business account
    //This check is running here because we are using as a middleware the saving image function
    if (req.isAuthenticated() && req.user.isBusiness === true) {
        //Defining the new coffee info
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

        //Creating the new coffee with the defined info
        Note.create(newNote, function (err, newlyNote) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to notes page
                req.flash("success", newNote.name + " created successfully");
                res.redirect("/notes");
            }
        });
    };
});


//Declaring the regular expression and function
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
//We export the router, it contains all our routes
module.exports = router;