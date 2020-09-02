import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loadUser, createRoom } from "../actions/authActions";
import { fetchMessages, getUserName } from "../actions/roomActions";
import { Button, Form, Label, FormGroup, Input } from "reactstrap";
import AppNavbar from "./AppNavbar";
// import auth from "../../../middleware/auth";

export class Dashboard extends Component {
	state = {
		selected: null,
		fetchedMessages: false,
		group_name: "",
		username: "",
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

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const req_body = {
			name: this.state.group_name,
			users: [this.state.username],
		};
		this.props.createRoom(req_body);
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
					{this.state.fetchedMessages && this.state.selected === room._id
						? this.props.room.messages.map((msg) => {
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
									const user = this.props.room.user_data.filter((user) => {
										return user._id === msg.sender;
									});
									if (user) {
										return (
											<div style={{ margin: "15px" }}>
												<p> {msg.body}</p>
												<p>{user[0].username}</p>
											</div>
										);
									} else {
										return <div></div>;
									}
								}
						  })
						: //   (INPUT BOX FOR SENDING MESSAGE)
						  null}
				</li>
			);
		});
		const finalAuthDisplay = (
			<React.Fragment>
				{authDisplay}
				<h2>Create Room</h2>
				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label htmlFor="name">Name</Label>
						<Input
							type="text"
							id="group_name"
							name="group_name"
							placeholder="Chat Name"
							className="mb-3"
							onChange={this.handleChange}
						/>
						<Label htmlFor="Username">Username</Label>
						<Input
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							className="mb-3"
							onChange={this.handleChange}
						/>
						<Button
							type="submit"
							color="dark"
							style={{ marginTop: "2rem" }}
							block
						>
							Create Room
						</Button>
					</FormGroup>
				</Form>
			</React.Fragment>
		);
		return (
			<div>
				<AppNavbar />
				<h1>Authorized access</h1>
				{finalAuthDisplay}
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
	createRoom,
})(Dashboard);
