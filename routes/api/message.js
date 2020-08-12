const express = require("express");
const router = express.Router();

// Models
const Room = require("../../models/Room");
const Message = require("../../models/Message");
// Authorization
const auth = require("../../middleware/auth");

// @route   POST api/message/
// @desc    Send a new message
// @access  Private
router.post("/", auth, (req, res) => {
	const user = req.user;
	// console.log("Get request in progress");
	const { body, sender, room } = req.body;
	if (!body || !sender || !room) {
		return res.status(400).json({ msg: "Enter all fields" });
	}
	const newMessage = new Message({
		body,
		sender,
		room,
	});
	newMessage
		.save()
		.then((message) => {
			Room.findById(room)
				.then((roomObj) => {
					roomObj.messages.push(message.id);
					roomObj
						.save()
						.then(() => res.json(message))
						.catch((err) => res.status(404).json({ success: false }));
				})
				.catch((err) => res.status(404).json({ success: false }));
		})
		.catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
