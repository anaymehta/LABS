var Equipment = require("../models/equipment");
var Order = require("../models/order");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkEquipmentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Equipment.findById(req.params.id,function(err,foundEquipment){
			if (err) {
				req.flash("error", "Equipment not found.");
				res.redirect("back");
			} else {
				if (foundEquipment.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to access that.");
		res.redirect("/login");
	}
}

middlewareObj.checkOrderOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Order.findById(req.params.id,function(err,foundOrder){
			if (err) {
				req.flash("error", "Order not found.");
				res.redirect("back");
			} else {
				if (foundOrder.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to access that.");
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to access that.");
	res.redirect("/login");
}

middlewareObj.isAdmin = function(req,res,next){
	if(req.isAuthenticated()){
		if(req.user.username==="admin"){
			return next();
		}
	}
	req.flash("error","Only the admin can access that.");
	res.redirect("back");
}

module.exports = middlewareObj;
