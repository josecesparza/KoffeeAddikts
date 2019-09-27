var express = require('express');
var router = express.Router();
var Tag = require('../models/tag');

router.get("/", function (req, res) {
    Tag.find({}, function (err, tags) {
        if (err) {
            console.log(err);
        } else {
            console.log("TAGS: " + tags);
            res.render("tags/new", { tags: tags });
        }
    });
});

module.exports = router;