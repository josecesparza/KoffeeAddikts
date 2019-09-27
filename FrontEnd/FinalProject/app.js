var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var seedDB = require('./seeds');

mongoose.connect("mongodb://localhost:27017/notes_app", { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

//Require Routes
var notesRoutes = require('./routes/notes');
var tagsRoutes = require('./routes/tags');

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.use("/notes/:id/tags", tagsRoutes);
app.use("/notes", notesRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});