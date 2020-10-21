import {CLEAR_POST, GET_ALL_POSTS, GET_POST, GET_POSTS, POST_ERROR, UPDATE_POST} from "../actions/types";

const initialState = {
	post: null,
	posts: [],
	repos: [],
	loading: true,
	error: {}
};

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
				repos: [],
				loading: false
			};
		default:
			return state;
	}
}
