const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../../models/User");
const Room = require("../../models/Room");
const auth = require("../../middleware/auth");

// @route   POST api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", (req, res) => {
	const { name, username, email, password } = req.body;

	//Validation
	if (!name || !email || !password || !username) {
		res.status(400).json({ msg: "Enter all fields" });
	}
	User.findOne({ email }).then((user) => {
		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}
	});
	User.findOne({ username }).then((user) => {
		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}
	});

	const newUser = new User({
		name,
		username,
		email,
		password,
	});
	//Create salt
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save().then((user) => {
				jwt.sign(
					{ id: user.id },
					process.env.jwtSecret || config.get("jwtSecret"),
					{ expiresIn: 3600 },
					(err, token) => {
						if (err) throw err;
						res.json({
							token,
							user: {
								id: user.id,
								name: user.name,
								email: user.email,
								username: user.username,
							},
						});
					}
				);
			});
		});
	});
});

// @route   POST api/auth/login
// @desc    Login new user
// @access  Public
router.post("/login", (req, res) => {
	const { email, password } = req.body;

	//Validation
	if (!email || !password) {
		res.status(400).json({ msg: "Enter all fields" });
	}
	User.findOne({ email }).then((user) => {
		if (!user) {
			return res.status(400).json({ msg: "User does not exist" });
		}
		//Validate password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (!isMatch)
				return res.status(400).json({ msg: "Invalid Credentials" });
			jwt.sign(
				{ id: user.id },
				process.env.jwtSecret || config.get("jwtSecret"),
				{ expiresIn: 3600 },
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							username: user.username,
							rooms: user.rooms,
							status: user.status,
						},
					});
				}
			);
		});
	});
});

// @route   GET api/auth/username
// @desc    Get public info of user
// @access  Public
router.get("/user/:id", (req, res) => {
	User.findById(req.params.id)
		.select("-email -password -rooms")
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			res.status(400).json({ msg: "Cannot access user data" });
		});
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get("/user", auth, (req, res) => {
	User.findById(req.user.id)
		.select("-password")
		.then((user) => {
			const { rooms } = user;
			const promises = rooms.map((room_id) => {
				return Room.findById(room_id)
					.select("-created_at -messages")
					.sort({ updated_at: -1 });
			});
			Promise.all(promises)
				.then((room_list) => {
					user.rooms = room_list;
					res.json(user);
				})
				.catch((err) =>
					res
						.status(400)
						.json({ msg: "Cannot access user right now" })
				);
		});
});

module.exports = router;
