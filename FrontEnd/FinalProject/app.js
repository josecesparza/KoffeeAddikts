//Require npm packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var flash = require('connect-flash');

//Require our seed file, we are just going to use it when we want to seed or clean the database
var seedDB = require('./seeds');
// seedDB();

//Connection to the database
//Local DB
mongoose.connect("mongodb://localhost:27017/notes_app", { useNewUrlParser: true, useUnifiedTopology: true });

//Make able the public folder to get the content from all the code
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

//Define ejs has the default view engine
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

//Require Routes of the other files
var coffeesRoutes = require('./routes/notes');
var usersRoutes = require('./routes/users');
var commentRoutes = require('./routes/comments');
var contactRoutes = require('./routes/contact');
var apiRoutes = require('./routes/api');

//Define the home route
app.get("/", function (req, res) {
    res.render("index");
});

//Define the start of the routes of the other files
app.use("/user", usersRoutes);
app.use("/notes", coffeesRoutes);
app.use("/notes/:id/comments", commentRoutes);
app.use("/contact", contactRoutes);
app.use("/api", apiRoutes);

//Start the server in the port 3000 in our localhost
const port = 3000;

app.listen(port, process.env.IP, function () {
    console.log("Server has started in port: " + port);
});

// HTTPS SERVER
// You'll' see some SSL warning. 
// That’s because our certificate ain’t issued by any verified organization.
// We can add exception to our browser or install the cerificate in a trusted server

// const https = require('https');
// const fs = require('fs');

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// https.createServer(options, app).listen(8000);