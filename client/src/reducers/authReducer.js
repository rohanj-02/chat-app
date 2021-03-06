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
} from "../actions/types";

const initialState = {
	token: localStorage.getItem("token"),
	isAuthenticated: null,
	isLoading: false,
	user: null,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case USER_LOADING:
			return { ...state, isLoading: true };
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				user: action.payload,
			};
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			localStorage.setItem("token", action.payload.token);
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				isLoading: false,
			};
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT_SUCCESS:
		case REGISTER_FAIL:
			localStorage.removeItem("token");
			return {
				...state,
				isAuthenticated: null,
				user: null,
				token: null,
				isLoading: false,
			};
		case ROOM_CREATED:
			const userNew = state.user;
			userNew.rooms.push(action.payload);
			return {
				...state,
				user: userNew,
			};
		default:
			return state;
	}
}
