const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const flash = require('connect-flash');
const Campground = require("./models/campground"),
      Comment    = require("./models/comment"),
      seedDb     = require("./seeds"),
      methodOverride = require("method-override"),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      User           = require('./models/users');
// seedDb();
const commentRoutes = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      commonRoutes   = require('./routes/index');



mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("CONNECTED TO DATABASE!!"))
.catch(err => console.log(err));

// passport confogurtion
app.use(require('express-session')({
    secret: 'once again luis goes there',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(methodOverride('_method'));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
// requring routes
app.use('/',commonRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes); 

app.listen(3000, function(){
    console.log("Yelp Camp, SERVER IS STARTED! @localhost:3000");
});