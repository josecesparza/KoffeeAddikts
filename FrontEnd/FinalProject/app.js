var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var flash = require('connect-flash');

var seedDB = require('./seeds');
// seedDB();

//Local DB
mongoose.connect("mongodb://localhost:27017/notes_app", { useNewUrlParser: true });

//Mongo Atlas DB
// mongoose.connect("mongodb+srv://developerjose:<password>@cluster0-uce7k.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });

app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

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

app.use(function (req, res, next) {
    //We're passing the user info
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Require Routes
var coffeesRoutes = require('./routes/notes');
var usersRoutes = require('./routes/users');
var commentRoutes = require('./routes/comments');
var contactRoutes = require('./routes/contact');
var apiRoutes = require('./routes/api');

app.get("/", function (req, res) {
    res.render("index");
});

app.use("/user", usersRoutes);
app.use("/notes", coffeesRoutes);
app.use("/notes/:id/comments", commentRoutes);
app.use("/contact", contactRoutes);
app.use("/api", apiRoutes);

app.listen(3000, process.env.IP, function () {
    console.log("Server has started!");
});