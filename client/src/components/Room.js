import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { loadUser } from "../actions/authActions";

export class Dashboard extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		user: PropTypes.object,
		room: PropTypes.object,
		isLoading: PropTypes.bool,
	};

	componentDidMount() {
		this.props.loadUser();
	}

	render() {
		if (this.props.isLoading) {
			return <h1> Loading Animation </h1>;
		}
		if (!this.props.isAuthenticated) {
			return (
				<div>
					<h1> Please login to continue</h1>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</div>
			);
		}

		const authDisplay = this.props.user.rooms.map((room) => {
			return (
				<li>
					<h2>{room.name}</h2>
				</li>
			);
		});
		return (
			<div>
				<h1>Authorized access</h1>
				{authDisplay}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	isLoading: state.auth.isLoading,
	user: state.auth.user,
});

export default connect(mapStateToProps, { loadUser })(Dashboard);
