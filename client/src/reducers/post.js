import {
	CLEAR_POST,
	DELETE_POST,
	GET_ALL_POSTS,
	GET_POST,
	GET_POSTS,
	POST_ERROR,
	UPDATE_POST,
	LOADING,
	SET_TAG
} from "../actions/types";
//At the beginning, we are loading, and we don't have data yet
const initialState = {
	post: null,
	posts: [],
	loading: true,
	error: {}
};
//Reducers define how the central Redux store should change, when an action happens
//For example, almost all of them say that the data is done loading after the action is dispatched
export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_POST:
			return {
				...state,
				post: payload,
				loading: false
			};
		case UPDATE_POST:
			return {
				...state,
				post: payload,
				loading: false
			};
		case SET_TAG:
			return {
				...state,
				tag: payload
			};
		case DELETE_POST:
			return {
				...state,
				post: state.post.filter(x => x !== payload),
				loading: false
			};
		case GET_POSTS:
			return {
				...state,
				posts: payload,
				loading: false
			};
		case GET_ALL_POSTS:
			return {
				...state,
				posts: payload,
				loading: false
			};
		case POST_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
				post: null
			};
		case CLEAR_POST:
			return {
				...state,
				posts: null,
				loading: false
			};
		case LOADING:
			return {
				...state,
				loading: true
			}
		default:
			return state;
	}
}
