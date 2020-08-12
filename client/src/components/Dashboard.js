import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { loadUser } from "../actions/authActions";

export class Dashboard extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
	};

	componentDidMount() {
		console.log("Mount Called");
		this.props.loadUser();
	}

	render() {
		if (!this.props.isAuthenticated) {
			return (
				<div>
					<h1> Please login to continue</h1>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</div>
			);
		}

		return (
			<div>
				<h1>Authorized access</h1>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { loadUser })(Dashboard);
