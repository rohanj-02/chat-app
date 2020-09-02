import React, { Component } from "react";
import PropTypes from "prop-types";

import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	NavbarText,
	Button,
} from "reactstrap";
import { connect } from "react-redux";
import { logout } from "../actions/authActions";

class AppNavbar extends Component {
	state = {
		navOpen: false,
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		user: PropTypes.object,
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
							{this.props.isAuthenticated ? (
								<React.Fragment>
									<NavItem>
										<NavbarText>
											Welcome {this.props.user.username}
										</NavbarText>
									</NavItem>
									<NavItem>
										<NavLink href="/">
											<Button onClick={this.props.logout}>
												Logout
											</Button>
										</NavLink>
									</NavItem>
								</React.Fragment>
							) : (
								<React.Fragment>
									<NavItem>
										<NavLink href="/login">Login</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="/register">
											Register
										</NavLink>
									</NavItem>
								</React.Fragment>
							)}
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(AppNavbar);
