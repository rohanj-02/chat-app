import {
	ADD_MESSAGE,
	SEND_MESSAGE,
	FETCH_MESSAGES,
	RECEIVED_MESSAGES,
	LEAVE_ROOM,
} from "../actions/types";

const initialState = {
	isFetching: false,
	id: "",
	messages: [],
	name: "",
	admin: [],
	users: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCH_MESSAGES:
			return {
				...state,
				isFetching: true,
			};
		case RECEIVED_MESSAGES:
			return {
				...state,
				isFetching: false,
				messages: action.payload.messages,
				name: action.payload.name,
				users: action.payload.users,
				admin: action.payload.admin,
				id: action.payload._id,
			};
		case ADD_MESSAGE:
		case SEND_MESSAGE:
			const msg = state.messages.concat(action.payload);
			return {
				...state,
				messages: msg,
			};
		case LEAVE_ROOM:
			return {
				isFetching: false,
				messages: [],
				name: "",
				id: "",
				users: [],
				admin: [],
			};
		default:
			return state;
	}
}
