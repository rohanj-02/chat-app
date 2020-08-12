const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();
app.use(express.json());

const db = process.env.mongoURI || config.get("mongoURI");

mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

//if production environment
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));
	//
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname + "client/build/index.html"));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
