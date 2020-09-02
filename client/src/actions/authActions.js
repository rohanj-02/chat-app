import axios from "axios";
import {
	USER_LOADING,
	USER_LOADED,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGOUT_SUCCESS,
	AUTH_ERROR,
	ROOM_CREATED,
} from "./types";
import { returnErrors } from "./errorActions";

export const tokenConfig = (getState) => {
	const token = getState().auth.token;
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	if (token) {
		config.headers["x-auth-token"] = token;
	}
	return config;
};

export const loadUser = () => (dispatch, getState) => {
	console.log("Load user called");
	dispatch({ type: USER_LOADING });
	axios
		.get("/api/auth/user", tokenConfig(getState))
		.then((res) => dispatch({ type: USER_LOADED, payload: res.data }))
		.catch((err) => {
			console.log(err);
			dispatch(returnErrors(err.response.data, err.response.status));
			// dispatch({
			// 	type: GET_ERRORS,
			// 	payload: { msg: "Some error", status: 401 },
			// });
			dispatch({ type: AUTH_ERROR });
		});
};

export const register = ({ name, username, email, password }) => (dispatch) => {
	const body = JSON.stringify({ name, username, email, password });
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	axios
		.post("api/auth/register", body, config)
		.then((res) => dispatch({ type: REGISTER_SUCCESS, payload: res.data }))
		.catch((err) => {
			dispatch(
				returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
			);
			dispatch({ type: REGISTER_FAIL });
		});
};

export const login = ({ email, password }) => (dispatch) => {
	const body = JSON.stringify({ email, password });
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	axios
		.post("api/auth/login", body, config)
		.then((res) => dispatch({ type: LOGIN_SUCCESS, payload: res.data }))
		.catch((err) => {
			dispatch(
				returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
			);
			dispatch({ type: LOGIN_FAIL });
		});
};

export const createRoom = ({ name, users }) => (dispatch, getState) => {
	const req_body = JSON.stringify({ name, users });
	axios
		.post("api/room", req_body, tokenConfig(getState))
		.then((res) => {
			dispatch({ type: ROOM_CREATED, payload: res.data });
		})
		.catch((err) => {
			dispatch(returnErrors(err.response.data, err.response.status));
		});
};

export const logout = () => {
	return {
		type: LOGOUT_SUCCESS,
	};
};
