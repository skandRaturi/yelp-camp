const Campground = require('../models/campground');
const Comment = require('../models/comment')

// middlewares
let middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundcampground) => {
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                if(foundcampground.author.id.equals(req.user.id)){
                    next();
                }else{
                    res.redirect('back')
                }
                
            }
        });
    }else{
        res.redirect('back');
    }
    
}
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundcomment) => {
            if(err){
                console.log(err);
                res.redirect('back');
            }else{
                if(foundcomment.author.id.equals(req.user.id)){
                    next();
                }else{
                    res.redirect('back')
                }
                
            }
        });
    }else{
        res.redirect('back');
    }
    
}
middlewareObj.isLoggedin = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('success', 'Please Login first!');
    res.redirect('/login');
}
module.exports = middlewareObj;