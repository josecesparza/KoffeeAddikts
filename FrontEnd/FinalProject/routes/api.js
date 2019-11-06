var express = require('express');
var router = express.Router();
var Note = require('../models/note');

//Creation of the API
router.get("/", function(req, res){
    //Explanation how to usethis API
    res.render("");
});

router.get("/notes", function (req, res) {
    //We have to do a query in the DB
    Note.find({ "public": true }, function (err, allNotes) {
        res.json(allNotes);
    });
});

router.get("/notes/:note_id", function (req, res) {
    //We have to do a query in the DB
    res.json(results);
});

module.exports = router;