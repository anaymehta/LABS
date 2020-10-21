var express = require("express");
var router = express.Router();
var Order = require("../models/order");
var Equipment = require("../models/equipment");
var middleware = require("../middleware");

//INDEX
router.get("/",function(req,res){
	Order.find({}, function(err,list){
		if(err){
			res.redirect("/");
		} else {
			res.render("order",{list:list});
		}
	});
})

//NEW ORDER
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("newOrder");
});

//CREATE ORDER
router.post("", middleware.isLoggedIn, function(req,res){
	Order.create(req.body.order, function(err,newlyCreated){
		if(err){
			console.log(err);
		} else {
			newlyCreated.author.id = req.user._id;
			newlyCreated.author.username = req.user.username;
			newlyCreated.save();
			req.flash("success", "New order succesfully created.")
			res.redirect("/order");
		}
	});
});

//TODAY'S ORDERS
router.get("/today",function(req,res){
	Order.find({}, function(err,list){
		if(err){
			req.flash("error","Could not find today's orders.");
			res.redirect("/");
		} else {
			res.render("today",{list:list});
		}
	});
});

//SHOW ORDER
router.get("/:id",function(req,res){
	Order.findById(req.params.id,function(err,foundOrder){
		if(err){
			res.redirect("/order");
		} else {
			res.render("showOrder",{order:foundOrder});
		}
	});
});

//UPDATE ORDER
router.get("/:id/edit", middleware.checkOrderOwnership, function(req,res){
	Order.findById(req.params.id,function(err,foundOrder){
		res.render("editOrder",{order:foundOrder});
	});
});


router.put("/:id", middleware.checkOrderOwnership, function(req,res){
	Order.findByIdAndUpdate(req.params.id, req.body.order, function(err, updatedOrder){
		if(err){
			req.flash("error","Error updating order.");
			res.redirect("/order");
		} else {
			req.flash("success","Successfully edited order.");
			res.redirect("/order/"+req.params.id);
		}
	});
});

//DELETE ORDER
router.delete("/:id", middleware.checkOrderOwnership, function(req,res){
	Order.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/order");
		} else {
			req.flash("success","Order succesfully deleted.")
			res.redirect("/order");
		}
	});
});

//ORDER-EQUIPMENT INDEX
router.get("/:id/eqList", middleware.checkOrderOwnership, function(req,res){
	Equipment.find({}, function(err,list){
		if(err){
			console.log(err);
		} else {
			res.render("indexOrder",{list:list, id: req.params.id});
		}
	})
});

//ADD ORDER-EQUIPMENT
router.post("/:id/eqList/:eq", middleware.checkOrderOwnership, function(req,res){
	Order.findById(req.params.id, function(err,order){
		if (err) {
			res.redirect("/order");
		} else {
			Equipment.findById(req.params.eq, function(err,equipment){
				if(err) {
					console.log(err);
				} else {
					order.equipments.push(equipment);
					order.save();
					req.flash("success", "Successfully added equipment.");
					res.redirect("/order/"+order._id+"/eqList");
				}
			});
		}
	});
})

module.exports = router;
