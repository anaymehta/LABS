var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Equipment = require("./models/equipment"),
	User = require("./models/user"),
	Order = require("./models/order")

var equipmentRoutes = require("./routes/equipment"),
	indexRoutes = require("./routes/index"),
	orderRoutes = require("./routes/orders")

//Database username and password removed to mantain security and privacy
mongoose.connect("mongodb://localhost/LABS");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs")
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//requiring routes
app.use(indexRoutes);
app.use("/eqList",equipmentRoutes);
app.use("/order",orderRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is listening");
});
