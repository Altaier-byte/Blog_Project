var Blog = require("../models/blog");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err|| !foundBlog){
			   req.flash("error", "Blog not found");
               res.redirect("/blogs");
           }  else {
               // does user own the campground?
            if(foundBlog.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission to do that !")
                res.redirect("/blogs");
            }
           }
        });
    } else {
		 req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Please log in first");
    res.redirect("/login");
}

module.exports = middlewareObj;