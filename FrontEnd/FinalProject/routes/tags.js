var express = require('express');
var router = express.Router();
var Tag = require('../models/tag');
var Note = require('../models/note');
var mongoose = require('mongoose');

//SHOW TAGS OF A NOTE
router.get("/:id", function (req, res) {
    Tag.findById(req.params.id, function (err, foundTag) {
        if (err) {
            console.log(err);
        } else {
            Note.find({tags: mongoose.Types.ObjectId(req.params.id)}, function(err, foundNotes){
                if(err){
                    console.log(err);
                } else{
                    console.log("Could be: " + foundNotes);
                    res.render("tags/show", { tag: foundTag, notes: foundNotes });
                }
            });
            
        }
    });

});

//

module.exports = router;