var express = require('express');
var app = express();

//Require Routes
var notesRoutes = require('./routes/notes');

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.use("/notes", notesRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});