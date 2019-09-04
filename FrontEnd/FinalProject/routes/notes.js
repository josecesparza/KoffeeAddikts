var express = require('express');
var router = express.Router();

var notes = [
    {
        title: "Note 1",
        content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos deserunt, inventore pariatur voluptatibus laudantium in."
    },
    {
        title: "Note 1",
        content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos deserunt, inventore pariatur voluptatibus laudantium in."
    }
];

router.get("/", function(req, res){
    res.render("notes/index", {notes: notes});
});

router.get("/new", function(req, res){
    res.render("notes/new")
});

router.post("/new", function(req, res){
    var newNote = req.body.note;

    console.log(newNote);
    notes.push(newNote);
    res.redirect("/notes");
});

module.exports = router;