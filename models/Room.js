const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	users: {
		type: Array,
		required: true,
	},
	admin: {
		type: Array,
		required: true,
	},
	messages: {
		type: Array,
		default: [],
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Room = mongoose.model("room", RoomSchema);
