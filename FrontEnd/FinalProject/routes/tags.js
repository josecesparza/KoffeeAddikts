var express = require('express');
var router = express.Router();
var Tag = require('../models/tag');

//SHOW TAGS OF A NOTE
router.get("/", function(req, res){
    res.render("tags/show");
});

module.exports = router;