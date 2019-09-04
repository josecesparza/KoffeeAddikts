var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    var notes = [
        {
            title: "Note 1",
            date: "22-12-2019",
            content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati dolorum sint veritatis quod architecto quibusdam.",
            Author: "Jose"  
        },
        {
            title: "Note 2",
            date: "02-12-2018",
            content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati dolorum sint veritatis quod architecto quibusdam.",
            Author: "Max"  
        }
    ];

    res.render("notes/index", {notes: notes});
});

module.exports = router;