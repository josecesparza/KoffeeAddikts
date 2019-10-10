var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');

var seedDB = require('./seeds');
seedDB();

mongoose.connect("mongodb://localhost:27017/notes_app", { useNewUrlParser: true });
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "This is the Secret Page Test",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    //We're passing the user info
    res.locals.currentUser = req.user;
    next();
});

//Require Routes
var notesRoutes = require('./routes/notes');
var usersRoutes = require('./routes/users')


app.get("/", function(req, res){
    res.render("index");
});

app.use("/user", usersRoutes);
app.use("/notes", notesRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});