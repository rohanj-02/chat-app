import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { loadUser } from "../actions/authActions";
import { fetchMessages, getUserName } from "../actions/roomActions";
import { Button } from "reactstrap";
import AppNavbar from "./AppNavbar";

export class Dashboard extends Component {
	state = {
		selected: null,
		fetchedMessages: false,
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		user: PropTypes.object,
		isLoading: PropTypes.bool,
		room: PropTypes.object,
	};

	componentDidMount() {
		this.props.loadUser();
	}

	handleClick = (id) => {
		this.props.fetchMessages(id);
		this.setState({
			fetchedMessages: true,
		});
		this.props.room.users.forEach((user) => {
			this.props.getUserName(user);
		});
	};

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
					<Button
						onClick={() => {
							this.setState({ selected: room._id });
							this.handleClick(room._id);
						}}
					>
						{room.name}
					</Button>
					{this.state.fetchedMessages
						? this.props.room.messages.map((msg) => {
								let display = (
									<div style={{ margin: "15px" }}>
										<p>{msg.body}</p>
									</div>
								);

								if (this.props.room.user_data.length === 0) {
									this.props.room.users.forEach((user) => {
										this.props.getUserName(user);
									});
									return (
										<div style={{ margin: "15px" }}>
											<p>{msg.body}</p>
										</div>
									);
								} else {
									if (msg.sender === this.props.user._id) {
										return (
											<div style={{ margin: "15px" }}>
												<p>{msg.body}</p>
												<p>You</p>
											</div>
										);
									}
									const user = this.props.room.user_data.filter(
										(user) => {
											return user._id === msg.sender;
										}
									);

									return (
										<div style={{ margin: "15px" }}>
											<p> {msg.body}</p>
											<p>{user[0].username}</p>
										</div>
									);
								}
						  })
						: //   (INPUT BOX FOR SENDING MESSAGE)
						  null}
				</li>
			);
		});
		return (
			<div>
				<AppNavbar />
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
	room: state.room,
});

export default connect(mapStateToProps, {
	loadUser,
	fetchMessages,
	getUserName,
})(Dashboard);
