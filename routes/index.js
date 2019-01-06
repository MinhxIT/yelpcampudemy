var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
//AUTH  ROUTES
//show register

router.get("/", function(req, res){
    res.render("landing");
});
router.get('/register',function(req,res){
    res.render("register");
})
// handle sign up login 
router.post("/register",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var newUser = new User({username:username});
    User.register(newUser,password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Register success, welcome to yelpcamp " + user.username);
            res.redirect('/campgrounds');
        });
    })
});
//show ;login form 
router.get('/login',function(req,res){
    res.render('login');
});
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
// logout 
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!")
    res.redirect("/campgrounds");
});

module.exports = router;