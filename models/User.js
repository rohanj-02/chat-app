const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	status: {
		type: Boolean,
		defaault: false,
	},
	rooms: {
		type: Array,
		default: [],
	},
});

module.exports = User = mongoose.model("user", UserSchema);
