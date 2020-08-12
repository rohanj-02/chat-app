import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import messageReducer from "./messageReducer";

export default combineReducers({
	auth: authReducer,
	error: errorReducer,
	message: messageReducer,
});
