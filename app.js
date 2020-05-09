var express                   = require("express"),
    app                       = express(),
    mongoose                  = require("mongoose"),
    bodyParser                = require("body-parser"),
	flash                     = require ("connect-flash"),
    expressSanitizer          = require("express-sanitizer"),
    methodOverride            = require('method-override'),
	passport                  = require("passport"),
    LocalStrategy             = require("passport-local"),
    Blog                      = require("./models/blog"),
    User                      = require("./models/user");

//Requiring Routes
var
blogRoutes = require("./routes/blogs"),
indexRoutes  = require("./routes/index");

mongoose.connect('mongodb+srv://Yelp:s2jLq0DBM6MqnrnM@cluster00-evx9o.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});
 // mongoose.connect("mongodb://localhost/Blog_Project_V1",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(flash());





//**********************
//Passport Config
//**********************

app.use(require("express-session")({
    secret: "One of the best blog sites :D",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Using Routes
app.use(indexRoutes);
app.use( blogRoutes);






app.listen(process.env.PORT|| 3000, process.env.IP, function(){
	  
	console.log("The Blog Server has started !");
});