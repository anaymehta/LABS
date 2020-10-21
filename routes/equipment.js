var express = require("express");
var router = express.Router();
var Equipment = require("../models/equipment");
var middleware = require("../middleware");

//INDEX
router.get("/",function(req,res){
	Equipment.find({}, function(err,list){
		if(err){
			console.log(err);
		} else {
			res.render("index",{list:list});
		}
	})
});

//NEW
router.get("/new", middleware.isAdmin, function(req,res){
	res.render("new");
});

//CREATE
router.post("", middleware.isAdmin, function(req,res){
	var newEquipment = req.body.equipment;
	Equipment.create(newEquipment, function(err,newlyCreated){
		if(err){
			req.flash("error","Error adding equipment.");
		} else {
			newlyCreated.author.id = req.user._id;
			newlyCreated.author.username = req.user.username;
			newlyCreated.save();
			req.flash("success","Successfully added equipment.")
			res.redirect("/eqList");
		}
	});
});

//SEARCH
router.get("/results",function(req,res){
	Equipment.find({name:req.query.name}, function(err,list){
		if(err){
			req.flash("error","Could not find equipment.");
			console.log(err);
		} else {
			res.render("index",{list:list});
		}
	});
});

//READ
router.get("/:id",function(req,res){
	Equipment.findById(req.params.id,function(err,foundEquipment){
		if(err){
			res.redirect("/eqList");
		} else {
			res.render("show",{equipment:foundEquipment});
		}
	});
});

//UPDATE
router.get("/:id/edit", middleware.checkEquipmentOwnership, function(req,res){
	Equipment.findById(req.params.id,function(err,foundEquipment){
		res.render("edit",{equipment:foundEquipment});
	});
});


router.put("/:id", middleware.checkEquipmentOwnership, function(req,res){
	Equipment.findByIdAndUpdate(req.params.id, req.body.equipment, function(err, updatedEquipment){
		if(err){
			req.flash("error","Error updating equipment.");
			res.redirect("/eqList");
		} else {
			req.flash("success","Successfully edited equipment.");
			res.redirect("/eqList/"+req.params.id);
		}
	});
});

//DESTROY
router.delete("/:id", middleware.checkEquipmentOwnership, function(req,res){
	Equipment.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error","Error deleting equipment.");
			res.redirect("/eqList");
		} else {
			req.flash("success","Successfully deleted equipment.");
			res.redirect("/eqList");
		}
	});
});

module.exports = router;
