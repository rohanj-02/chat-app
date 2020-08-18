import {
	ADD_MESSAGE,
	SEND_MESSAGE,
	FETCHING_MESSAGES,
	RECEIVED_MESSAGES,
	LEAVE_ROOM,
	FETCH_USER_PUBLIC,
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";
import axios from "axios";

//needs a messagae object as params
export const addMessage = ({ body, room, sender }) => (dispatch, getState) => {
	const req_body = JSON.stringify({ body, room, sender });
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	axios
		.post("api/message", req_body, tokenConfig(getState))
		.then((res) => dispatch({ type: ADD_MESSAGE, payload: res.data }))
		.catch((err) =>
			dispatch(returnErrors(err.response.data, err.response.status))
		);
};

export const fetchMessages = (roomID) => (dispatch, getState) => {
	dispatch(setMessagesLoading());
	axios
		.get(`/api/room/${roomID}`, tokenConfig(getState))
		.then((res) =>
			dispatch({ type: RECEIVED_MESSAGES, payload: { ...res.data } })
		)
		.catch((err) =>
			dispatch(returnErrors(err.response.data, err.response.status))
		);
	// gets full room object including users admin and all
};

export const getUserName = (id) => (dispatch) => {
	axios
		.get(`api/auth/user/${id}`)
		.then((res) => {
			dispatch({ type: FETCH_USER_PUBLIC, payload: res.data });
		})
		.catch((err) => {
			dispatch(returnErrors(err.response.data, err.response.status));
		});
};

export const leaveRoom = () => {
	return {
		type: LEAVE_ROOM,
	};
};

export const setMessagesLoading = () => {
	return {
		type: FETCHING_MESSAGES,
	};
};
