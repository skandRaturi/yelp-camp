const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

router.get("/", function(req, res){
    // geting all campgrounds from database
    console.log(req.user);
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err)
        }else{
            res.render("index", {campgrounds: campgrounds, currentUser: req.user});
        }
    });
});
// CREATE ROUTE
router.post("/", middleware.isLoggedin, function(req, res){
    let newcamp = req.body.name;
    let newimage = req.body.url;
    let newDescrip = req.body.description;
    let newObject = {name: newcamp, image: newimage, description: newDescrip , author: req.user};
    // Create a campground inside the db
    Campground.create(newObject,(err, campground) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
    
});
// NEW ROUTE
router.get("/new", middleware.isLoggedin, function(req, res){
    res.render("new"); 
});
// SHOW ROUTE : Shows more ifo about a campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            res.render("show", { campground: foundCampground });
        }
    });
});
// edit 
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundcampground) => {
        res.render('edit', {campground: foundcampground});    
    });
});
// 
// update
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        res.redirect('/campgrounds/' + updatedCampground.id);
    });
});

// 
// Destroy campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
        if(err){
          console.log(err);
          res.redirect('/campgrounds/' + req.params.id);  
        }else{
            res.redirect('/campgrounds')
        }
    });
});
// 
module.exports = router;