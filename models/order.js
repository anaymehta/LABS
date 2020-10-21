var mongoose = require("mongoose");
var Equipment = require("./equipment");

var equipmentSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var orderSchema = new mongoose.Schema({
	name: String,
	date: Date,
	period: String,
	info: String,
	equipments: [equipmentSchema],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Order", orderSchema);
