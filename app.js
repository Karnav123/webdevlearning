var express      = require("express");
var app          = express();
var bodyParser   = require("body-parser");
var mongoose     = require("mongoose");
var flash        = require("connect-flash");
var Campground   = require("./models/campground");
var Comment      = require("./models/comment");
var User         = require("./models/user");
var seedDB       = require("./seeds");
var passport     = require("passport");
var LocalStartegy = require("passport-local");
var methodOverrid = require("method-override");
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverrid("_method"));
app.use(flash());
// seedDB(); seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "I love to sleep!",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
// start the server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server YelpCamp has started..."); 
});