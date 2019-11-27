const express = require("express");
const path = require("path");
const creds = require('./credentials')
const passport = require('passport');

// Flash plugin instead of doing it ourselves
const flash = require('connect-flash');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set port app will run on
app.set("port", process.env.PORT || 3000);

// Set up sessions and flash scope
const session = require("express-session");
app.use(session(creds.session));
app.use( flash() );

// Handle form submissions
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Static file hosting
app.use(express.static(path.join(__dirname, "public")));

// database setup
require("./models/db");

// requires the model with Passport-Local Mongoose plugged in
const User = require("./models/user");

// Start up passport
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mware = require("./lib/middleware");

// Serves up the login screen
app.get("/login", function(req, res) {
  res.render("login", {

    // Intercept flash messages of different kinds here, can possibly have both
    message: req.flash('info'),
    error: req.flash('error')
  });
});

// Processes the login screen. Will redirect to the /login page again, along with a failure flash message
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {

  // If they get this far they have authenticated so send them to the home page
  res.redirect('/');
});

// The register page - doesn't require login
app.get("/register", function(req, res) {
  res.render("register", {
    message: req.flash('info')
  });
});

// Process the register action
app.post("/register", async function(req, res) {
  if(req.body.username && req.body.password){
    await User.register(new User({username: req.body.username}),req.body.password);
    req.flash('info', 'Thanks for registering!');
  }
  res.redirect("/login");
});


// The home page.  Notice the home-grown login middleware being used.
app.get("/", mware.requireLogin, function(req, res) {
  res.render("home", {
    message: req.flash('info'),
    user: req.user
  });
});

// The super secret admin page, notice the admin middlware protecting this one.
app.get("/admin", mware.requireAdmin, function(req, res) {
  res.render("admin");
});


// The logout route. It'll log the user out, then set a flash message before going back to the login screen.
app.get('/logout', function(req, res) {
  req.logout();
  req.flash('info', 'You are logged out');
  res.redirect('/login');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
  res.status(404);
  res.render("404");
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
