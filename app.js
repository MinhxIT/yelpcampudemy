const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const seedDB = require("./seeds");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes = require("./routes/index");
const flash = require("connect-flash");
var app = express();

// CONNECT DB
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true},(err)=>{
    if(err){
        console.log("Kết nối lỗi");
    }else{
        console.log("Kết nối thành công");
    }
});
var Campground = require("./models/campground");
var User = require("./models/user");
//var Comment = require("./models/comment");
var User = require("./models/user");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs'); // sử dụng engine ejs
//seedDB();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// INDEX
// PASSPORT Configuration

app.use(require("express-session")({
    secret:"MXOZ yelpcamp",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// INDEX_ SHOW ALL CAMPGROUND
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started!");
 });