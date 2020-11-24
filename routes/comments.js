const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const comment = require('../models/comment');
const middleware = require('../middleware');


router.get("/new", middleware.isLoggedin, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("newComment",{campground: foundCampground});
    });
});
router.post("/", middleware.isLoggedin,(req, res) => {
    Campground.findById(req.params.id,(err, foundcampground) => {
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, (err, comment) => {    
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                foundcampground.comments.push(comment);
                foundcampground.save();
                res.redirect("/campgrounds/" + foundcampground._id);
            });
            
        }
    });
});
// DELETE ROUTES
router.delete("/:comment_id",middleware.checkCommentOwnership, middleware.isLoggedin, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if(err){
            res.redirect('back');
            console.log(err);
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});
// edit comment
router.get('/:comment_id/edit',middleware.checkCommentOwnership, middleware.isLoggedin, (req, res) => {
    console.log(req.params);
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err){
          console.log(err);
          res.redirect('back');
      }else{
          res.render('commentEdit', {campground_id: req.params.id, comment: foundComment});
      }  
    });
    
});
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect('back');
        }else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
module.exports = router;