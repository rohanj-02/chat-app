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
				var messages = [];
				room.messages.forEach((id) => {
					Message.findById(id).then((message) => {
						messages.push(message);
					});
				});
				room.messages = messages;
				res.json(room);
			} else {
				res.status(403).json({
					msg: "You do not have the credentials to join this room",
				});
			}
		})
		.catch((err) => res.status(404).json({ success: false }));
});

// @route   POST api/room/
// @desc    Create new room
// @access  Private
router.post("/", auth, (req, res) => {
	const { name, users } = req.body;
	if (!name || users.length == 0) {
		return res.status(400).json({ msg: "Enter all fields" });
	}
	// users has all other users id except the creator
	users.push(req.user.id);
	const newRoom = new Room({
		name: req.body.name,
		users: users,
		admin: req.body.user.id,
	});
	newRoom.save().then((room) => {
		room.users.forEach((user_id) => {
			User.findById(user_id).then((user) => {
				user.rooms.push(room.id);
				user.save().then((user) => {
					res.json(room);
				});
			});
		});
	});
});

module.exports = router;
