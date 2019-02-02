var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/campgrounds", function(req, res){
    
    // Get data from MongoDb
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else
       {
           res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user});
       }
    });
});

// CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
   
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name, price: price, image: image, description: desc, author: author};
   Campground.create(newCampground, function(err, newlyCreatedCampground){
      if(err){
          console.log(err);
      }else{
          res.redirect("/campgrounds");
      } 
   });
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //console.log(req.params.id);
            //console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   // find and update
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }else{
           // redirect (show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

// DESTROY CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds");
      }
   });
});


module.exports = router;