import React, { Component } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
} from "reactstrap";

class AppNavbar extends Component {
	state = {
		navOpen: false,
	};

	toggleNavbar = () => {
		this.setState({
			navOpen: !this.state.navOpen,
		});
	};

	render() {
		return (
			<div>
				<Navbar color="dark" dark expand="sm" className="mb-5">
					<NavbarBrand href="#">Chat Application</NavbarBrand>
					<NavbarToggler onClick={this.toggleNavbar} />
					<Collapse isOpen={this.state.navOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink href="/login">Login</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/register">Register</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

export default AppNavbar;
