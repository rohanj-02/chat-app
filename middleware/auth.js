const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
	const token = req.header("x-auth-token");
	console.log("middleware called");
	if (!token) {
		//Unauthorized
		return res.status(401).json({ msg: "No token! Authorization denied" });
	}
	try {
		const decoded = jwt.verify(
			token,
			process.env.jwtSecret || config.get("jwtSecret")
		);
		req.user = decoded;
		next();
	} catch (e) {
		res.status(400).json({ msg: "Token invalid" });
	}
}

module.exports = auth;