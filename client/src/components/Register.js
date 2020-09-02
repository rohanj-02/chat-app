import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { Redirect } from "react-router-dom";
import { clearErrors } from "../actions/errorActions";
import { register } from "../actions/authActions";

export class Register extends Component {
	state = {
		name: "",
		username: "",
		email: "",
		password: "",
		error_msg: "",
		redirect: false,
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		register: PropTypes.func.isRequired,
		error: PropTypes.object.isRequired,
		clearErrors: PropTypes.func.isRequired,
	};

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated } = this.props;
		if (error !== prevProps.error) {
			if (error.id === "REGISTER_FAIL") {
				this.setState({ error_msg: error.msg.msg });
			} else {
				this.setState({ error_msg: null });
			}
		}

		if (isAuthenticated) {
			this.setState({
				redirect: true,
			});
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { email, username, name, password } = this.state;
		this.props.register({ name, username, email, password });
	};

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	render() {
		return (
			<React.Fragment>
				{this.state.redirect ? <Redirect to="/dashboard" /> : null}
				{this.state.error_msg ? (
					<Alert color="danger">{this.state.error_msg}</Alert>
				) : null}
				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label htmlFor="name">Name</Label>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder="Name"
							className="mb-3"
							onChange={this.handleChange}
						/>
						<Label htmlFor="username">Username</Label>
						<Input
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							className="mb-3"
							onChange={this.handleChange}
						/>
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							className="mb-3"
							onChange={this.handleChange}
						/>
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							id="password"
							name="password"
							placeholder="Password"
							className="mb-3"
							onChange={this.handleChange}
						/>
						<Button
							color="dark"
							style={{ marginTop: "2rem" }}
							block
						>
							Register
						</Button>
					</FormGroup>
				</Form>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error,
});
export default connect(mapStateToProps, { register, clearErrors })(Register);
