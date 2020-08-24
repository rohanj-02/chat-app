const express = require("express");
const router = express.Router();

// Models
const Room = require("../../models/Room");
const Message = require("../../models/Message");
const User = require("../../models/User");
// Authorization
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");

// add user and delete user if admin of room

// @route   GET api/room/:id
// @desc    Get room object
// @access  Private
router.get("/:id", auth, (req, res) => {
	const user = req.user;
	// console.log("Get request in progress");
	Room.findById(req.params.id)
		.then((room) => {
			const { users } = room;
			if (users.includes(user.id)) {
				const messages = room.messages;
				room.messages = [];
				const promises = messages.map((id) => {
					return Message.findById(id);
				});

				Promise.all(promises).then((msg) => {
					room.messages = msg;
					res.json(room);
				});
			} else {
				res.status(403).json({
					msg: "You do not have the credentials to join this room",
				});
			}
		})
		.catch((err) => {
			return res.status(404).json({ success: false });
		});
});

// @route   POST api/room/
// @desc    Create new room
// @access  Private
router.post("/", auth, (req, res) => {
	const { name, users } = req.body;
	if (!name || users.length == 0) {
		return res.status(400).json({ msg: "Enter all fields" });
	}

	const promises = users.map((username) => {
		return User.findOne({ username }).select("_id");
	});

	let userID = [];
	Promise.all(promises).then((userObj) => {
		userObj.forEach((u) => {
			userID.push(u.id);
		});
		// userID = userObj;
		userID.push(req.user.id);
		console.log(userID);
		const newRoom = new Room({
			name: name,
			users: userID,
			admin: [req.user.id],
		});
		newRoom
			.save()
			.then((room) => {
				room.users.forEach((user_id) => {
					console.log(user_id);
					User.findById(user_id)
						.then((user) => {
							user.rooms.push(room.id);
							user
								.save()
								.then((user) => {})
								.catch((err) => {
									return res.status(404).json({ success: false });
								});
						})
						.catch((err) => {
							return res.status(404).json({ success: false });
						});
				});
				res.json(room.id);
			})
			.catch((err) => {
				return res.status(404).json({ success: false });
			});
	});
});

module.exports = router;
