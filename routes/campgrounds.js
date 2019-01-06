var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
router.get("/", function(req, res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Lỗi " + err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })
    //
});

//CREATE - ADD NEW CAMPGROUND
router.post('/',middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username : req.user.username
    }
    var newCampground = {
        name: name,
        image: image,
        description:description,
        author:author
    };
    Campground.create(newCampground,function(err,newlyCreated){
            if(err){
                console.log(err);
            }else{
                console.log('Success');
            }
        }
    )
    res.redirect("/campgrounds");
});
// SHOW FORM TO CREATE NEW CAMP
router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render('campgrounds/new');
});
// SHOW DETAIL CAMP
router.get("/:id",function(req,res){
    var idCampground = req.params.id;
    Campground.findById(idCampground,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
});
//EDIT CAMPGROUND ROUTER
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res) { 
    var idCampground = req.params.id;
    Campground.findById(idCampground,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});
// UPDATE CAMPGROUNG ROUTER
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    var idCampground = req.params.id;
    var data = res.body.campground;
    Campground.findByIdAndUpdate(idCampground,data,function(err,updateCampground){
        if(err){
            
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+idCampground);
        }
    });
});
// delete
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    var idCampground = req.params.id;
    Campground.findByIdAndRemove(idCampground,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});
// MIDWARE


module.exports = router;