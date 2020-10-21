var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
  res.render("home");
});

router.get("/about",function(req,res){
  res.render("about");
});

router.get("/contact",function(req,res){
  res.render("contact");
});

router.get("/choice",function(req,res){
  res.render("choice");
});

//=============
//	AUTH ROUTES
//=============

//show register form
router.get("/register", function(req,res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to LABS, "+user.username+"!");
			res.redirect("/");
		});
	});
});

//show login form
router.get("/login", function(req,res){
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}) ,function(req,res){
});

//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/");
});

module.exports = router;
