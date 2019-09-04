var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.render("notes/index");
});

module.exports = router;