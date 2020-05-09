var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/blogs", function(req, res){
	//Searching blogs
    if(req.query.search){
	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Blog.find({title:regex}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("blogs/index", {blogs: blogs}); 
        }
    });
		
	}else{
		//Get all blogs from the database
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("blogs/index", {blogs: blogs}); 
        }
    });
		
	}
		
		
	
	
});

router.get("/blogs/new",middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

router.post("/blogs", middleware.isLoggedIn, function(req, res){
    
	// get data from form and add to Blogs array
    var title = req.body.title;	
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlog = {title: title, image: image, description: description, author:author}
    
	
	
   Blog.create(newBlog, function(err, newlyCreated){
       console.log(newlyCreated);
      if(err){
          res.render("blogs/new");
      } else {
          res.redirect("/blogs");
      }
   });
});

//Show page
router.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err|| !foundBlog){
		   req.flash("error", "Blog not found!");
          res.redirect("/blogs");
      } else {
          res.render("blogs/show", {blog: foundBlog});
      }
   });
});

router.get("/blogs/:id/edit",middleware.checkBlogOwnership, function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
		   req.flash("error", "Blog not found!")
           console.log(err);
           res.redirect("/")
       } else {
           res.render("blogs/edit", {blog: blog});
       }
   });
});

router.put("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});

router.delete("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/blogs");
       }
   }); 
});





module.exports = router;