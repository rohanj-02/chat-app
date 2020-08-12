const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	body: {
		type: String,
		required: true,
	},
	room: {
		type: String,
		required: true,
	},
	sender: {
		type: String,
		required: true,
	},
	status: {
		type: Boolean,
		default: false,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Message = mongoose.model("message", MessageSchema);
