import {
	ADD_MESSAGE,
	SEND_MESSAGE,
	FETCHING_MESSAGES,
	RECEIVED_MESSAGES,
	LEAVE_ROOM,
	FETCH_USER_PUBLIC,
} from "../actions/types";

const initialState = {
	isFetching: false,
	id: "",
	messages: [],
	name: "",
	admin: [],
	users: [],
	user_data: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case FETCHING_MESSAGES:
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
				user_data: [],
			};
		case FETCH_USER_PUBLIC:
			const temp = state.user_data.concat(action.payload);
			return {
				...state,
				user_data: temp,
			};
		default:
			return state;
	}
}
