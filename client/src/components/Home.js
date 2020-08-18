import React from "react";
import AppNavbar from "./AppNavbar";
import { Button } from "reactstrap";

function Home() {
	return (
		<div>
			<AppNavbar />
			Home Page
			<Button href="/dashboard" color="danger">
				Dashboard
			</Button>
		</div>
	);
}

export default Home;
